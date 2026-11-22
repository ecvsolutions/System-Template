<script>
  let { value = 0 } = $props();

  let pct = $derived(Math.min(100, Math.max(0, value)));
</script>

<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}>
  <div class="bar__fill" style:width="{pct}%"></div>
</div>
