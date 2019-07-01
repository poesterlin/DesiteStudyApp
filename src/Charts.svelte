<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";

  $: data = [];

  onMount(() => getstudyData());

  async function getstudyData() {
    const request = await fetch(document.location.origin + "/results");
    const response = await request.json();

    data = (await response)
      .filter(r => r.data.task && r.data.task.image)
      .filter(getComplexity);
    create(data);
  }

  function setComplexity(event) {
    const c = parseInt(event.target.value);
    if (c && !isNaN(c) && c <= 3 && c >= 1) {
      create(data.filter(el => getComplexity(el) === c));
    } else {
      create(data);
    }
  }

  function create(data) {
    const ctx = document.getElementById("chart");
    const ctx2 = document.getElementById("chart2");
    const ctx3 = document.getElementById("chart3");

    const groups = group(data, getType).sort((a, b) =>
      alphabetical(getType(a[0]), getType(b[0]))
    );

    const questionGroups = groups.map(g =>
      group(g, el => el.data.task.question).sort((a, b) =>
        alphabetical(getQuestion(a[0]), getQuestion(b[0]))
      )
    );

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 9
            }
          }
        ]
      }
    };

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: questionGroups[0].map((vis, i) => getQuestion(vis[i])),
        datasets: questionGroups.map(questions => {
          return {
            label: getType(questions[0][0]),
            data: questions.map(q =>
              avg(q.filter(f => f.flag).map(f => f.data.timing))
            ),
            backgroundColor: getColor(questions[0][0]),
            borderColor: getColor(questions[0][0])
          };
        })
      },
      options
    });

    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: questionGroups[0].map((vis, i) => getQuestion(vis[i])),
        datasets: questionGroups.map(questions => {
          return {
            label: getType(questions[0][0]),
            data: questions.map(q => sum(q.filter(f => !f.flag).map(() => 1))),
            backgroundColor: getColor(questions[0][0]),
            borderColor: getColor(questions[0][0])
          };
        })
      },
      options
    });

    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: questionGroups[0].map((vis, i) => getQuestion(vis[i])),
        datasets: questionGroups.map(questions => {
          return {
            label: getType(questions[0][0]),
            data: questions.map(q => sum(q.filter(f => !f.flag).map(() => 1))),
            backgroundColor: getColor(questions[0][0]),
            borderColor: getColor(questions[0][0])
          };
        })
      },
      options
    });

    new Chart(ctx3, {
      type: "line",
      data: {
        labels: new Array(
          Math.max(
            ...groups[0].map(el =>
              Math.floor(el.data.questionIndex / 4).toString()
            )
          )
        )
          .fill(null)
          .map((_, i) => i),
        datasets: groups.map(g => {
          return {
            label: getType(g[0]),
            data: group(g, g =>
              Math.floor(g.data.questionIndex / 4).toString()
            ).map(a => avg(a.map(a => a.data.timing))),
            backgroundColor: getColor(g[0]),
            borderColor: getColor(g[0])
          };
        })
      },
      options
    });
  }

  function getType(el) {
    const img = el.data.task.image;
    const f = img.indexOf(" (");
    return img.substr(7, f - 7);
  }

  function getQuestion(el) {
    if (el) {
      return el.data.task.question;
    } else {
      return "";
    }
  }

  function getColor(el) {
    const type = getType(el);
    switch (type) {
      case "Desite":
        return "rgba(0, 0, 190, 0.5)";
      case "Maps":
        return "rgba(0, 190, 0, 0.5)";
      case "DB":
        return "rgba(190, 0, 0, 0.5)";
    }
  }

  function getComplexity(el) {
    const img = el.data.task.image;
    const start = img.indexOf("(");
    const stop = img.indexOf(")");
    const scenario = parseInt(img.substr(start + 1, stop - start - 1));
    switch (scenario) {
      case 1:
        return 3;
      case 2:
        return 2;
      case 3:
        return 1;
      case 4:
        return 3;
      case 5:
        return 1;
      case 6:
        return 2;
    }
  }

  function alphabetical(a, b) {
    return ("" + a).localeCompare(b);
  }

  function group(data, fn) {
    const groups = {};
    data.forEach(element => {
      groups[fn(element)] = true;
    });

    return Object.keys(groups).map(g => data.filter(el => fn(el) === g));
  }

  function avg(data) {
    return ~~(sum(data) / data.length);
  }
  function sum(data) {
    if (!Array.isArray(data) || data.length === 0 || Array.isArray(data[0])) {
      return 0;
    }
    return data.reduce((a, b) => a + b, 0);
  }
</script>

<style>
  :global(body) {
    overflow: auto;
  }
  .chart-container {
    display: block;
    height: 100vh;
    width: 90vw;
  }
</style>

<div>
  <span>Complexity:</span>
  <input type="number" on:change={c => setComplexity(c)} />
</div>
Timing:
<div class="chart-container">
  <canvas id="chart" />
</div>
Errors:
<div class="chart-container">
  <canvas id="chart2" />
</div>
Learning:
<div class="chart-container">
  <canvas id="chart3" />
</div>
