<script>
  let { label, value, foot = '', tone = 'primary' } = $props();
</script>

<div class="kpi kpi--{tone}">
  <div class="kpi__label">{label}</div>
  <div class="kpi__value">{value}</div>
  {#if foot}<div class="kpi__foot">{foot}</div>{/if}
</div>
