<script>
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import Sidebar from '#lib/components/Sidebar.svelte';
  import Topbar from '#lib/components/Topbar.svelte';
  import MobileTabbar from '#lib/components/MobileTabbar.svelte';

  let { children } = $props();

  let drawerOpen = $state(false);

  afterNavigate(() => {
    drawerOpen = false;
  });
</script>

<a class="skip" href="#main">Skip to content</a>

<div class="app">
  <Sidebar open={drawerOpen} />
  {#if drawerOpen}
    <button class="scrim" type="button" aria-label="Close menu" onclick={() => (drawerOpen = false)}></button>
  {/if}
  <div class="main">
    <Topbar onmenu={() => (drawerOpen = !drawerOpen)} />
    <main id="main" class="view">
      {@render children()}
    </main>
  </div>
  <MobileTabbar onmore={() => (drawerOpen = !drawerOpen)} />
</div>
