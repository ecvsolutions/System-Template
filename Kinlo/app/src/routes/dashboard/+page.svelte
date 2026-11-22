<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Kpi from '#lib/components/Kpi.svelte';
  import Pill from '#lib/components/Pill.svelte';
  import ProgressBar from '#lib/components/ProgressBar.svelte';

  const kpis = [
    { label: 'Sales today', value: '£0.00', foot: 'Placeholder', tone: 'sage' },
    { label: 'Balance', value: '£0.00', foot: 'Placeholder', tone: 'gold' },
    { label: 'Shifts', value: '0', foot: 'Placeholder', tone: 'slate' },
    { label: 'Open tasks', value: '0', foot: 'Placeholder', tone: 'peach' },
  ];

  const tasks = [
    { title: 'Placeholder task A', tag: 'Due', tone: 'warn' },
    { title: 'Placeholder task B', tag: 'New', tone: 'info' },
  ];
</script>

<PageHeader title="Dashboard" subtitle="Placeholder summary" />

<div class="kpis">
  {#each kpis as kpi (kpi.label)}
    <Kpi {...kpi} />
  {/each}
</div>

<div class="grid grid--3">
  <Card>
    <div class="card__head"><h2 class="card__title">Revenue</h2></div>
    <ProgressBar value={60} />
  </Card>
  <Card>
    <div class="card__head"><h2 class="card__title">Schedule</h2></div>
    <p class="muted">No items yet.</p>
  </Card>
  <Card>
    <div class="card__head"><h2 class="card__title">Needs you</h2></div>
    <ul class="stack">
      {#each tasks as task (task.title)}
        <li class="row">
          <span>{task.title}</span>
          <Pill tone={task.tone}>{task.tag}</Pill>
        </li>
      {/each}
    </ul>
  </Card>
</div>
