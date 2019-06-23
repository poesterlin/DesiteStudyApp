<script>
  import Study from './Study.svelte';
  import Results from './Results.svelte';
  import Charts from './Charts.svelte';

  $: mode = '';
</script>

{#if mode === 'study'}
  <Study />
{:else if mode === 'results'}
  <Results />
{:else if mode === 'charts'}
  <Charts />
{:else}
  <button on:click={() => (mode = 'study')}>study mode</button>
  <button on:click={() => (mode = 'results')}>result mode</button>
  <button on:click={() => (mode = 'charts')}>charts</button>
{/if}
