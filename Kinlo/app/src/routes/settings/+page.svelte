<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';

  const sections = ['Profile', 'Business', 'Notifications', 'Security'];
</script>

<PageHeader title="Settings" subtitle="Placeholder" />

<div class="split">
  <Card>
    <ul class="stack">
      {#each sections as section (section)}
        <li><button class="link" type="button">{section}</button></li>
      {/each}
    </ul>
  </Card>

  <Card>
    <form class="form" onsubmit={(e) => e.preventDefault()}>
      <label>
        <span class="muted">Display name</span>
        <input class="input" type="text" placeholder="Placeholder" />
      </label>
      <label>
        <span class="muted">Email</span>
        <input class="input" type="email" placeholder="name@example.com" />
      </label>
      <div><button class="btn btn--primary" type="submit">Save</button></div>
    </form>
  </Card>
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .form label {
    display: flex;
    flex-direction: column;
  }

  .form .input {
    margin: 4px 0 12px;
  }

  .link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--primary);
    cursor: pointer;
  }
</style>
