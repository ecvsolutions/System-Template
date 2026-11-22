<script>
  let { columns = [], rows = [] } = $props();
</script>

<div class="table-wrap">
  <table class="table">
    <thead>
      <tr>
        {#each columns as col (col.key)}
          <th class:num={col.num}>{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (i)}
        <tr>
          {#each columns as col (col.key)}
            <td class:num={col.num}>{row[col.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
