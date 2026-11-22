'use strict';

/**
 * Animation extraction for capture.js.
 *
 * Reads three sources:
 *  1. Web Animations API: every CSS animation/transition/WAAPI or JS-driven
 *     animation that is running at the moment of the call (keyframes + timing).
 *  2. Stylesheets: @keyframes definitions and rules that set transition /
 *     animation (same-origin sheets only; cross-origin sheets are in assets/).
 *  3. Libraries: well-known animation globals and script URLs (GSAP, Lenis, ...).
 *
 * Also exports sampling helpers:
 *  - sampleElement(): per-frame computed style of one element for N ms,
 *    optionally triggered by hover. This is how you recover an easing curve
 *    from JS-driven motion that CSS does not expose.
 */

// Animation/transition related CSS properties kept in stylesheet scan.
const MOTION_PROPS = ['transition', 'animation', 'transform', 'opacity', 'filter', 'will-change'];

// Globals that reveal a JS animation library.
const LIB_GLOBALS = {
  gsap: 'GSAP', ScrollTrigger: 'GSAP ScrollTrigger', Lenis: 'Lenis smooth scroll',
  anime: 'anime.js', AOS: 'AOS', lottie: 'Lottie', bodymovin: 'Lottie (bodymovin)',
  Motion: 'Motion (Framer Motion)', framerMotion: 'Framer Motion', THREE: 'three.js',
  Swiper: 'Swiper', barba: 'Barba.js', locomotive: 'Locomotive Scroll',
  ScrollMagic: 'ScrollMagic', Splitting: 'Splitting.js', tsParticles: 'tsParticles',
};

// Collect everything in one page.evaluate call so the result is one JSON blob.
async function collectAnimations(page) {
  return page.evaluate(({ motionProps, libGlobals }) => {
    const selectorOf = (el) => {
      if (!el || !el.tagName) return null;
      let s = el.tagName.toLowerCase();
      if (el.id) s += `#${el.id}`;
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 3) : [];
      if (cls.length) s += '.' + cls.join('.');
      return s;
    };

    // 1. Running animations (CSS + WAAPI + JS libs that use WAAPI).
    const running = document.getAnimations({ subtree: true }).map((a) => {
      const eff = a.effect;
      const target = eff && eff.target;
      const kind = a.constructor && a.constructor.name;
      return {
        kind,
        name: a.animationName || a.transitionProperty || a.id || null,
        target: selectorOf(target),
        playState: a.playState,
        timing: eff ? eff.getComputedTiming() : null,
        keyframes: eff && eff.getKeyframes ? eff.getKeyframes() : [],
      };
    });

    // 2. Stylesheets: @keyframes and motion-related rules.
    const keyframes = {};
    const rules = [];
    const walk = (ruleList) => {
      for (const rule of ruleList) {
        // CSSKeyframesRule = 7; CSSStyleRule = 1; grouping rules (media, supports) have cssRules.
        if (rule.type === 7) {
          keyframes[rule.name] = Array.from(rule.cssRules).map((k) => ({
            key: k.keyText,
            css: k.style.cssText,
          }));
        } else if (rule.type === 1 && rule.style) {
          const picked = {};
          for (const p of motionProps) {
            const v = rule.style.getPropertyValue(p);
            if (v) picked[p] = v;
          }
          if (Object.keys(picked).length) rules.push({ selector: rule.selectorText, styles: picked });
        } else if (rule.cssRules) {
          walk(rule.cssRules);
        }
      }
    };
    const sheetErrors = [];
    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch (e) {
        sheetErrors.push(sheet.href || '(inline)'); // cross-origin: read from assets/
      }
    }

    // 3. Libraries: globals first, then script URLs.
    const libs = new Set();
    for (const [g, label] of Object.entries(libGlobals)) {
      if (typeof window[g] !== 'undefined') libs.add(label);
    }
    for (const s of document.scripts) {
      const src = s.src || '';
      if (/gsap/i.test(src)) libs.add('GSAP (script)');
      if (/lenis/i.test(src)) libs.add('Lenis (script)');
      if (/lottie|bodymovin/i.test(src)) libs.add('Lottie (script)');
      if (/framer|motion\./i.test(src)) libs.add('Motion/Framer (script)');
      if (/animejs|anime\./i.test(src)) libs.add('anime.js (script)');
      if (/aos/i.test(src) && /aos[./-]/i.test(src)) libs.add('AOS (script)');
      if (/three(\.min)?\.js/i.test(src)) libs.add('three.js (script)');
    }

    return {
      running,
      keyframes,
      cssRules: rules,
      libraries: Array.from(libs),
      unreadableSheets: sheetErrors,
    };
  }, { motionProps: MOTION_PROPS, libGlobals: LIB_GLOBALS });
}

// Scroll the page in steps and record which animations are running at each position.
// Lazy/scroll-triggered motion only appears after its trigger position is passed.
async function scrollTimeline(page, stepPx = null, settleMs = 350) {
  return page.evaluate(async ({ stepPx, settleMs }) => {
    const step = stepPx || Math.max(400, Math.round(window.innerHeight / 2));
    const total = document.body.scrollHeight;
    const samples = [];
    for (let y = 0; y <= total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, settleMs));
      const names = document.getAnimations({ subtree: true })
        .filter((a) => a.playState === 'running')
        .map((a) => (a.animationName || a.transitionProperty || a.constructor.name));
      samples.push({ y: Math.round(window.scrollY), running: [...new Set(names)] });
    }
    window.scrollTo(0, 0);
    return samples;
  }, { stepPx, settleMs });
}

// Record computed style of one element every frame for durationMs.
// If hoverSelector is set, the hover is performed while sampling runs.
async function sampleElement(page, { selector, props, durationMs = 1500, hover = false }) {
  const sampling = page.evaluate(
    ({ selector, props, durationMs }) => new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (!el) return reject(new Error(`sample selector not found: ${selector}`));
      const frames = [];
      let t0 = null;
      const tick = (t) => {
        if (t0 === null) t0 = t;
        const cs = getComputedStyle(el);
        const row = { t: Math.round(t - t0) };
        for (const p of props) row[p] = cs.getPropertyValue(p);
        frames.push(row);
        if (t - t0 < durationMs) requestAnimationFrame(tick);
        else resolve(frames);
      };
      requestAnimationFrame(tick);
    }),
    { selector, props, durationMs }
  );
  if (hover) await page.hover(selector).catch(() => {});
  return sampling;
}

module.exports = { collectAnimations, scrollTimeline, sampleElement };
