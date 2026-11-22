<script>
  import { page } from '$app/state';

  let { onmore = () => {} } = $props();

  const tabs = [
    { href: '/dashboard', label: 'Home' },
    { href: '/inbox', label: 'Inbox' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/finance', label: 'Finance' },
  ];
</script>

<nav class="tabbar" aria-label="Primary">
  {#each tabs as tab (tab.href)}
    <a
      class="tabbar__pill"
      href={tab.href}
      aria-current={page.url.pathname.startsWith(tab.href) ? 'page' : undefined}
    >
      {tab.label}
    </a>
  {/each}
  <button class="tabbar__pill" type="button" onclick={onmore}>More</button>
</nav>
