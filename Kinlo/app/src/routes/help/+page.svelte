<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';

  const guides = ['Getting started', 'Billing basics', 'Team access'];
  const faqs = [
    { q: 'Placeholder question A?', a: 'Placeholder answer A.' },
    { q: 'Placeholder question B?', a: 'Placeholder answer B.' },
  ];
</script>

<PageHeader title="Help centre" subtitle="Placeholder" />

<Card>
  <input class="input" type="search" placeholder="Search help" aria-label="Search help" />
</Card>

<div class="grid grid--3">
  {#each guides as guide (guide)}
    <Card><h2 class="card__title">{guide}</h2></Card>
  {/each}
</div>

<Card>
  <h2 class="card__title">FAQ</h2>
  {#each faqs as faq (faq.q)}
    <details class="faq">
      <summary>{faq.q}</summary>
      <p class="muted">{faq.a}</p>
    </details>
  {/each}
</Card>

<style>
  .faq {
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
  }

  .faq summary {
    cursor: pointer;
    font-weight: 600;
  }
</style>
