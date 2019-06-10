<script>
  import { createEventDispatcher } from "svelte";
  export let question;
  const dispatch = createEventDispatcher();

  function next() {
    dispatch("next");
  }
</script>


<style>
  b {
    display: block;
    width: 99vw;
    height: 50vh;
    padding-top: 50vh;
    text-align: center;
  }
</style>

<b on:click={next}> {question} </b>
