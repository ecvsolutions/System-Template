<script>
  let { title, subtitle = '', actions } = $props();
</script>

<header class="phead">
  <div>
    <h1>{title}</h1>
    {#if subtitle}<p class="muted">{subtitle}</p>{/if}
  </div>
  {#if actions}<div class="row">{@render actions()}</div>{/if}
</header>
