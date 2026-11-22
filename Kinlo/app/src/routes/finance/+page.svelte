<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import DataTable from '#lib/components/DataTable.svelte';
  import Kpi from '#lib/components/Kpi.svelte';
  import ProgressBar from '#lib/components/ProgressBar.svelte';

  const kpis = [
    { label: 'Income', value: '£0.00', tone: 'sage' },
    { label: 'Spend', value: '£0.00', tone: 'peach' },
    { label: 'Uncategorised', value: '0', tone: 'gold' },
  ];

  const budgets = [
    { name: 'Category A', pct: 40 },
    { name: 'Category B', pct: 75 },
  ];

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'payee', label: 'Payee' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', num: true },
  ];

  const rows = [
    { date: '00 Mon', payee: 'Placeholder payee', category: 'Category A', amount: '£0.00' },
    { date: '00 Mon', payee: 'Placeholder payee', category: 'Category B', amount: '£0.00' },
  ];
</script>

<PageHeader title="Finance" subtitle="Placeholder" />

<div class="kpis">
  {#each kpis as kpi (kpi.label)}
    <Kpi {...kpi} />
  {/each}
</div>

<div class="split">
  <Card>
    <div class="card__head"><h2 class="card__title">Budgets</h2></div>
    <ul class="stack">
      {#each budgets as budget (budget.name)}
        <li>
          <div class="row"><span>{budget.name}</span><span class="muted">{budget.pct}%</span></div>
          <ProgressBar value={budget.pct} />
        </li>
      {/each}
    </ul>
  </Card>

  <Card flush>
    <DataTable {columns} {rows} />
  </Card>
</div>
