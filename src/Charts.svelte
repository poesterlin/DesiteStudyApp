<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";

  onMount(() => getstudyData());

  async function getstudyData() {
    const request = await fetch(document.location.origin + "/results");
    const response = await request.json();

    const data = (await response).filter(r => r.data.task && r.data.task.image);
    create(data);
  }

  function create(data) {
    const ctx = document.getElementById("chart");

    const modifier = getType;

    const groups = group(data, modifier);

    const c = new Chart(ctx, {
      type: "line",
      data: {
        labels: groups.map(g => modifier(g[0])),
        datasets: [
          {
            label: "time by visualization type",
            data: groups.map(g =>
              avg(g.filter(d => d.flag).map(d => d.data.timing))
            )
          },
          {
            label: "wrong by visualization type",
            data: groups.map(g =>
              sum(g.filter(d => !d.flag).map(f => (f ? 1 : 0)))
            ),
            backgroundColor: "red",
            borderColor: "red"
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    console.log(c.data.datasets);
  }

  function getType(el) {
    const img = el.data.task.image;
    const f = img.indexOf(" (");
    return img.substr(7, f - 7);
  }

  function group(data, fn) {
    const groups = {};
    data.forEach(element => {
      groups[fn(element)] = true;
    });

    return Object.keys(groups).map(g => data.filter(el => fn(el) === g));
  }

  function avg(data) {
    return sum(data) / data.length;
  }
  function sum(data) {
    return data.reduce((a, b) => a + b, 0);
  }
</script>

<style>
  div {
    display: block;
    height: 80vh;
    width: 90vw;
  }
</style>

<div class="chart-container">
  <canvas id="chart" />
</div>
