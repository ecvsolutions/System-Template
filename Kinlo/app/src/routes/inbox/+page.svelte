<script>
  import PageHeader from '#lib/components/PageHeader.svelte';
  import Card from '#lib/components/Card.svelte';
  import Avatar from '#lib/components/Avatar.svelte';
  import Pill from '#lib/components/Pill.svelte';

  const messages = [
    { id: '1', from: 'Sample Sender A', subject: 'Placeholder subject A', unread: true },
    { id: '2', from: 'Sample Sender B', subject: 'Placeholder subject B', unread: false },
  ];

  let selected = $state(messages[0].id);
  let current = $derived(messages.find((m) => m.id === selected));
</script>

<PageHeader title="Inbox" subtitle="Placeholder" />

<div class="split">
  <Card flush>
    <ul class="mail">
      {#each messages as message (message.id)}
        <li>
          <button
            type="button"
            class="mail__item"
            class:is-on={message.id === selected}
            onclick={() => (selected = message.id)}
          >
            <Avatar name={message.from} />
            <span class="mail__body">
              <span class="mail__from">{message.from}</span>
              <span class="muted">{message.subject}</span>
            </span>
            {#if message.unread}<Pill tone="info">New</Pill>{/if}
          </button>
        </li>
      {/each}
    </ul>
  </Card>

  <Card>
    <h2 class="card__title">{current?.subject}</h2>
    <p class="muted">From: {current?.from}</p>
    <textarea class="input" rows="4" placeholder="Write a reply"></textarea>
    <button class="btn btn--primary" type="button">Send</button>
  </Card>
</div>
