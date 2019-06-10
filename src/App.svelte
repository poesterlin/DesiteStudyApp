<script>
  import Image from "./Image.svelte";
  import Question from "./Question.svelte";

  $: paths = ["r1.jpg", "r2.jpg", "r3.jpg"];
  $: quests = ["whaaat?", "why", "why not"];
  $: state = "question";
  $: index = 0;
  $: path = paths[~~(index / quests.length)];
  $: quest = quests[index % quests.length];

  function next() {
    switch (state) {
      case "question":
        state = "image";
        break;

      case "image":
        state = "clear";
        index += 1;
        setTimeout(next, 1500);
        break;

      default:
        state = "question";
        break;
    }
  }
</script>

<style>
  :global(body) {
    padding: 0;
  }
</style>

{#if state === 'question'}
  <Question question={quest} on:next={next} />
{:else if state === 'image'}
  <Image imgSrc={path} on:next={next} question={quest} />
{:else}
  <div class="white"></div>
{/if}
