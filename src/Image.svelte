<script>
  import { createEventDispatcher } from "svelte";
  export let imgSrc = "";
  export let question = "";

  const dispatch = createEventDispatcher();

  $: x = 0;
  $: y = 0;
  $: show = false;

  function track(event) {
    x = event.pageX;
    y = event.pageY;
    show = true;
  }

  function next() {
    dispatch("next");
  }
</script>

<style>
  img {
    margin: auto;
    display: block;
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
    width: 100vw;
    height: 100vh;
  }

  div {
    --size: 48px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2);
    background: #ff0000d4;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.31);
  }
</style>

<b>{question}</b>
<img src={imgSrc} on:click={track} alt="" />
{#if show}
  <div class="pointer" on:click={next} style="top: {y}px; left: {x}px;" />
{/if}
