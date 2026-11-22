<script>
  let { options = [], value = $bindable() } = $props();
</script>

<div class="seg" role="group">
  {#each options as option (option.value)}
    <button
      type="button"
      class="seg__opt"
      aria-pressed={value === option.value}
      onclick={() => (value = option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
