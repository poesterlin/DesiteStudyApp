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
    margin: 5px auto 0;
    display: block;
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    width: 100vw;
    height: 100vh;
  }

  div.pointer {
    --size: 48px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2);
    background: #ff0000d4;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.31);
  }

  b {
    width: 60vw;
    margin: 10px auto 0;
    display: block;
    font-size: 140%;
  }

  .buttons {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  button {
    margin: 10px 10px 0;
    flex: 1 1 50%;
    max-width: 50%;
  }
</style>

<b>{question}</b>
<div class="buttons">
  <button on:click={() => next(true, false)}>Mehrere Antworten möglich</button>
  <button on:click={() => next(false, true)}>keine Antwort</button>
</div>
<img src={imgSrc} on:click={track} alt="" />
{#if show}
  <div
    class="pointer"
    on:click={() => next(false, false)}
    style="top: {y}px; left: {x}px;" />
{/if}
