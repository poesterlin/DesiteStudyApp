<script>
  import Image from './Image.svelte';
  import Question from './Question.svelte';

  let quests = [
    'Mit welcher Route kommen Sie als erstes ans Ziel?',
    'Mit welcher Route müssen Sie am wenigsten Umsteigen?',
    'Mit welcher Route müssen Sie am wenigsten Laufen?',
    'Welche Route braucht am wenigsten Zeit?'
  ];
  $: paths = [];
  $: state = 'question';
  $: index = 0;
  $: path = paths[index];
  $: quest = quests[index % quests.length];

  $: fillPaths();

  function fillPaths() {
    const urlParams = new URLSearchParams(window.location.search);
    const clear = urlParams.get('clear');
    if (clear === 'true') {
      done();
    }
    const id = urlParams.get('index');
    if (id && parseInt(id)) {
      index = parseInt(id);
    }

    const temp = new Array(6)
      .fill(null)
      .map((_, i) => i)
      .flatMap(n => [`Desite (${n + 1})`, `Maps (${n + 1})`, `DB (${n + 1})`])
      .map(n => `images/${n}.jpg`);

    paths = shuffle(temp).flatMap(n =>
      new Array(quests.length).fill(null).map(() => n)
    );
    console.log(paths);
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function next(selection) {
    switch (state) {
      case 'question':
        state = 'image';
        break;

      case 'image':
        state = 'clear';
        index += 1;

        post({
          questionIndex: index,
          task: { image: path, question: quest },
          ...selection.detail
        });

        pushState();

        if (!path) {
          done();
          alert('test is done');
          fillPaths();
        }

        setTimeout(next, 200);
        break;

      default:
        state = 'question';
        break;
    }
  }

  function post(json, path = '/record') {
    const xhr = new XMLHttpRequest();
    const url = document.location.origin + path;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 201) {
        console.log('successful post', json);
      }
    };
    xhr.send(JSON.stringify(json));
  }

  function pushState() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('index', index);
    const newRelativePathQuery =
      window.location.pathname + '?' + searchParams.toString();
    history.pushState(null, '', newRelativePathQuery);
  }

  function done() {
    index = 0;
    pushState();
  }
</script>

<style>
  :global(body) {
    padding: 0;
    user-select: none;
    overflow: hidden;
  }
</style>

{#if state === 'question'}
  <Question question={quest} on:next={next} />
{:else if state === 'image'}
  <Image imgSrc={path} on:next={next} question={quest} />
{:else}
  <div class='white' />
{/if}
