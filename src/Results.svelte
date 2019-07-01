<script>
  import Image from "./Image.svelte";
  import Question from "./Question.svelte";
  import { onMount } from "svelte";

  $: paths = [];
  $: quests = [];
  $: studyData = [];
  $: imgIdx = 0;
  $: qIdx = 0;
  $: current = [];
  $: filtered = [];
  $: skipped = () => current.filter(r => r.data.inconclusive);
  $: multiple = () => current.filter(r => r.data.multiple);
  onMount(() => getstudyData());

  function getstudyData() {
    fetch(document.location.origin + "/results")
      .then(response => response.json())
      .then(data => {
        data = data.filter(r => r.data.task && r.data.task.image);
        studyData = data;
        const images = {};
        data.forEach(element => {
          images[element.data.task.image] = true;
        });

        paths = Object.keys(images);
        getQuestions();
        filterRes();
      })
      .catch(error => console.error(error));
  }

  function getQuestions() {
    const q = {};
    studyData
      .filter(r => r.data.task.image === paths[imgIdx])
      .forEach(element => {
        q[element.data.task.question] = true;
      });

    quests = Object.keys(q);
  }

  function filterRes() {
    current = studyData
      .filter(r => r.data.task.image === paths[imgIdx])
      .filter(r => r.data.task.question === quests[qIdx]);

    filtered = current
      .map(r => {
        if (r.data.skipped || r.data.multiple) {
          r.data.location = { x: 0, y: 0 };
        }
        return r;
      })
      .filter(r => r.data.location.x > 0 && validComplexity(r));

    console.log(filtered);
  }

  function validComplexity(el) {
    const img = el.data.task.image;
    const f = img.indexOf(" (");
    const scenario = parseInt(img[f + 2]);
    return scenario <= 6;
  }

  function next() {
    if (quests.length > qIdx + 1) {
      qIdx += 1;
    } else {
      imgIdx += 1;
      qIdx = 0;

      getQuestions();

      if (!paths[imgIdx]) {
        done();
      }
    }
    filterRes();
  }

  function flag(id, toggle) {
    const res = studyData.find(res => res._id === id);
    res.flag = toggle ? !res.flag : false;
    post({ id, flag: res.flag });
    filterRes();
  }

  function post(json, path = "/flag") {
    const xhr = new XMLHttpRequest();
    const url = document.location.origin + path;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log("successful post", json);
      }
    };
    xhr.send(JSON.stringify(json));
  }

  function done() {
    imgIdx = 0;
    qIdx = 0;
    alert("done");
  }
  function flagSkipped() {
    skipped().forEach(el => flag(el._id));
  }
  function flagMultiple() {
    multiple().forEach(el => flag(el._id));
  }
</script>

<style>
  div.pointer {
    --size: 48px;
    position: absolute;
    width: var(--size);
    height: var(--size);
    margin: calc(var(--size) / -2);
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.31);
    opacity: 0.6;
  }
  img {
    margin: 5px auto 0;
    display: block;
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    width: 100vw;
    height: 100vh;
  }

  div.header {
    display: flex;
    flex-flow: row wrap;
    margin: auto;
    width: 50%;
  }
  button,
  b {
    flex: 1 1 100%;
    max-width: 100%;
    text-align: center;
  }
  b {
    font-size: 150%;
  }
</style>

{#if paths[imgIdx] && quests[qIdx]}
  <div class="header">
    <b>{quests[qIdx]}</b>
    <button on:click={next}>next</button>
    <div>
      <div>
         {skipped().length} skipped
        <button on:click={flagSkipped}>flag</button>
      </div>
      <div>
         {multiple().length} multiple
        <button on:click={flagMultiple}>flag</button>
      </div>
    </div>
  </div>
  <img src={paths[imgIdx]} alt="" />

  {#each filtered as res}
    <div
      class="pointer"
      style="background: {res.flag ? 'green' : 'red'}; top: {res.data.location.y + 100}px;
      left: {res.data.location.x}px; "
      on:click={() => flag(res._id, true)} />
  {/each}

{:else}
  <button on:click={next}>next</button>
{/if}
