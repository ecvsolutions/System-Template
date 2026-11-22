<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import DataTable from '#lib/components/DataTable.svelte';
  import SegmentedControl from '#lib/components/SegmentedControl.svelte';

  let period = $state('week');

  const options = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  const bars = [30, 55, 42, 70, 48, 90, 64];

  const columns = [
    { key: 'name', label: 'Item' },
    { key: 'total', label: 'Total', num: true },
  ];

  const rows = [
    { name: 'Placeholder row A', total: '£0.00' },
    { name: 'Placeholder row B', total: '£0.00' },
  ];
</script>

<PageHeader title="Reports" subtitle="Placeholder">
  {#snippet actions()}
    <SegmentedControl {options} bind:value={period} />
  {/snippet}
</PageHeader>

<div class="split">
  <Card>
    <div class="card__head"><h2 class="card__title">Trend ({period})</h2></div>
    <div class="chart" aria-hidden="true">
      {#each bars as h, i (i)}
        <div class="chart__bar" style:height="{h}%"></div>
      {/each}
    </div>
  </Card>

  <Card flush>
    <DataTable {columns} {rows} />
  </Card>
</div>

<style>
  .chart {
    height: 200px;
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }

  .chart__bar {
    flex: 1;
    background: var(--primary);
    border-radius: 6px 6px 0 0;
  }
</style>
