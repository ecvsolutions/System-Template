<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Avatar from '#lib/components/Avatar.svelte';
  import Pill from '#lib/components/Pill.svelte';
  import SegmentedControl from '#lib/components/SegmentedControl.svelte';

  let view = $state('rota');

  const options = [
    { value: 'rota', label: 'Rota' },
    { value: 'leave', label: 'Leave' },
  ];

  const people = [
    { name: 'Sample Person A', status: 'On shift', tone: 'good' },
    { name: 'Sample Person B', status: 'Off', tone: 'plain' },
  ];
</script>

<PageHeader title="Payroll" subtitle="Placeholder">
  {#snippet actions()}
    <SegmentedControl {options} bind:value={view} />
  {/snippet}
</PageHeader>

<Card>
  {#if view === 'rota'}
    <ul class="stack">
      {#each people as person (person.name)}
        <li class="row">
          <Avatar name={person.name} />
          <span>{person.name}</span>
          <Pill tone={person.tone}>{person.status}</Pill>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="muted">No leave requests.</p>
  {/if}
</Card>
