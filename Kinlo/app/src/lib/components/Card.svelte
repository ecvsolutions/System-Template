<script>
  let { flush = false, children } = $props();
</script>

<section class="card" class:card--flush={flush}>
  {@render children?.()}
</section>
