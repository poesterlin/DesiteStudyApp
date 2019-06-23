<script>
	export let nav;

</script>

<button on:click={() => nav.navigate('/study')}>study mode</button>
<button on:click={() => nav.navigate('/results')}>result mode</button>
<button on:click={() => nav.navigate('/charts')}>charts</button>