<script>
  import { createEventDispatcher } from "svelte";
  export let imgSrc = "";
  export let question = "";

  const dispatch = createEventDispatcher();

  $: x = 0;
  $: y = 0;
  $: show = false;
  $: timestamp = Date.now();
  let selectStamp = 0;

  $: resetTime(imgSrc);

  function resetTime() {
    timestamp = Date.now();
  }

  function track(event) {
    x = event.pageX;
    y = event.pageY;
    show = true;
    selectStamp = Date.now();
  }

  function next(multiple, inconclusive) {
    if (multiple || inconclusive) {
      selectStamp = Date.now();
    }
    dispatch("next", {
      multiple,
      inconclusive,
      location: { x, y },
      timing: selectStamp - timestamp
    });
  }
</script>

<style>
  img {
    margin: auto;
    display: block;
    max-width: 100vw;
    max-height: 90vh;
    object-fit: contain;
    width: 100vw;
    height: 100vh;
  }

  div {
    --size: 35px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2);
    background: #ff0000d4;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.31);
  }

  b {
    width: 50vw;
    margin: auto;
    display: block;
  }

  button {
    margin: 10px auto;
    display: block;
  }
</style>

<b>{question}</b>
<button on:click={() => next(true, false)}>Mehrere Antworten möglich</button>
<button on:click={() => next(false, true)}>keine Antwort</button>
<img src={imgSrc} on:click={track} alt="" />
{#if show}
  <div
    class="pointer"
    on:click={() => next(false, false)}
    style="top: {y}px; left: {x}px;" />
{/if}
