<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Pill from '#lib/components/Pill.svelte';

  const steps = [
    { label: 'Draft', state: 'done' },
    { label: 'Sent for signature', state: 'current' },
    { label: 'Countersigned', state: 'todo' },
  ];

  const contracts = [
    { title: 'Placeholder contract A', tone: 'warn', tag: 'Pending' },
    { title: 'Placeholder contract B', tone: 'good', tag: 'Signed' },
  ];
</script>

<PageHeader title="Contracts" subtitle="Placeholder" />

<div class="split">
  <Card>
    <div class="card__head"><h2 class="card__title">Signing progress</h2></div>
    <ol class="steps">
      {#each steps as step (step.label)}
        <li class="step step--{step.state}">{step.label}</li>
      {/each}
    </ol>
  </Card>

  <Card>
    <ul class="stack">
      {#each contracts as contract (contract.title)}
        <li class="row">
          <span>{contract.title}</span>
          <Pill tone={contract.tone}>{contract.tag}</Pill>
        </li>
      {/each}
    </ul>
  </Card>
</div>

<style>
  .steps {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .step {
    padding-left: 14px;
    border-left: 3px solid var(--line);
    color: var(--muted);
  }

  .step--done {
    border-color: var(--good);
    color: var(--ink);
  }

  .step--current {
    border-color: var(--primary);
    color: var(--ink);
    font-weight: 600;
  }
</style>
