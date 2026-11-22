<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Pill from '#lib/components/Pill.svelte';

  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  const events = { 4: 'info', 11: 'warn', 19: 'accent' };
</script>

<PageHeader title="Calendar" subtitle="Month view placeholder" />

<Card>
  <div class="month">
    {#each days as day (day)}
      <div class="month__cell">
        <span class="month__num">{day}</span>
        {#if events[day]}<Pill tone={events[day]}>Event</Pill>{/if}
      </div>
    {/each}
  </div>
</Card>

<style>
  .month {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .month__cell {
    min-height: 84px;
    padding: 8px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .month__num {
    color: var(--muted);
    font-size: 13px;
  }
</style>
