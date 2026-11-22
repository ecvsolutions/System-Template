<script>
  import { page } from '$app/state';

  let { onmenu = () => {} } = $props();

  let crumbs = $derived(page.url.pathname.split('/').filter(Boolean));

  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  }
</script>

<header class="topbar">
  <button class="ibtn ibtn--menu" type="button" aria-label="Open menu" onclick={onmenu}>☰</button>
  <nav class="crumbs" aria-label="Breadcrumb">
    {#each crumbs as crumb, i (i)}
      {#if i > 0}<span aria-hidden="true">/</span>{/if}
      <span class:muted={i < crumbs.length - 1}>{crumb}</span>
    {:else}
      <span>Home</span>
    {/each}
  </nav>
  <label class="searchpill">
    <span class="sr-only">Search</span>
    <input type="search" placeholder="Search" />
  </label>
  <span class="topbar__spacer"></span>
  <button class="btn btn--dark" type="button">New</button>
  <button class="ibtn" type="button" aria-label="Toggle theme" onclick={toggleTheme}>◐</button>
</header>
