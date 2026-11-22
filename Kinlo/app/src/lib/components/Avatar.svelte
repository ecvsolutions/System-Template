<script>
  let { name = '', size = 'md' } = $props();

  let initials = $derived(
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  );
</script>

<span class="av" class:av--lg={size === 'lg'} aria-label={name}>{initials}</span>
