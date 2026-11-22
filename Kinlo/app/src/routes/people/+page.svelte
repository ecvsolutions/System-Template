<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Avatar from '#lib/components/Avatar.svelte';
  import Pill from '#lib/components/Pill.svelte';

  const people = [
    { name: 'Sample Person A', role: 'Role placeholder', tag: 'Active' },
    { name: 'Sample Person B', role: 'Role placeholder', tag: 'Leave' },
    { name: 'Sample Person C', role: 'Role placeholder', tag: 'Active' },
  ];
</script>

<PageHeader title="People" subtitle="Directory placeholder" />

<div class="grid grid--3">
  {#each people as person (person.name)}
    <Card>
      <div class="row">
        <Avatar name={person.name} size="lg" />
        <div>
          <div>{person.name}</div>
          <div class="muted">{person.role}</div>
        </div>
      </div>
      <p><Pill tone="info">{person.tag}</Pill></p>
    </Card>
  {/each}
</div>
