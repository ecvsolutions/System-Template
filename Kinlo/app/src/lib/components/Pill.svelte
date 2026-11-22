<script>
  let { tone = 'plain', children } = $props();
</script>

<span class="pill pill--{tone}">{@render children?.()}</span>
