<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Pill from '#lib/components/Pill.svelte';

  const columns = [
    { title: 'To approve', tone: 'warn', items: ['Placeholder bill A', 'Placeholder bill B'] },
    { title: 'Scheduled', tone: 'info', items: ['Placeholder bill C'] },
    { title: 'Paid', tone: 'good', items: ['Placeholder bill D'] },
  ];
</script>

<PageHeader title="Accounts" subtitle="Bills board placeholder" />

<div class="grid grid--3">
  {#each columns as column (column.title)}
    <Card>
      <div class="card__head">
        <h2 class="card__title">{column.title}</h2>
        <Pill tone={column.tone}>{column.items.length}</Pill>
      </div>
      <ul class="stack">
        {#each column.items as item (item)}
          <li class="bill">{item}</li>
        {/each}
      </ul>
    </Card>
  {/each}
</div>

<style>
  .bill {
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
  }
</style>
