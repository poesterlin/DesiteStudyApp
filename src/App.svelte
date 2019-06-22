<script>
  import Study from './Study.svelte'
  import Results from './Results.svelte'

  $: mode = '';
</script>

<style>
  /* your styles go here */
</style>

{#if mode === 'study'}
  <Study />
{:else if mode === 'results'}
  <Results />
{:else}
  <button on:click={() => (mode = 'study')}>study mode</button>
  <button on:click={() => (mode = 'results')}>result mode</button>
{/if}
