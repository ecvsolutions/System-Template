<script>
  import { page } from '$app/state';
  import { navGroups } from '#lib/nav.js';

  let { open = false } = $props();
</script>

<aside class="sidebar" class:open aria-label="Main">
  <div class="sidebar__head">
    <a class="brand" href="/dashboard">
      <span class="brand__mark" aria-hidden="true">B</span>
      <span class="brand__text">
        <span class="brand__name">Brand</span>
        <span class="brand__sub">Placeholder</span>
      </span>
    </a>
  </div>
  <nav class="sidebar__nav">
    {#each navGroups as group (group.label)}
      <div class="navgroup">
        <div class="navgroup__label">{group.label}</div>
        {#each group.items as item (item.href)}
          <a
            class="nav__item"
            href={item.href}
            aria-current={page.url.pathname.startsWith(item.href) ? 'page' : undefined}
          >
            <span class="nav__icon" aria-hidden="true">{item.label[0]}</span>
            <span class="nav__label">{item.label}</span>
          </a>
        {/each}
      </div>
    {/each}
  </nav>
</aside>
