<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
function drawFermentationChart(data) {
  const ctx = document.getElementById("fermChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(d => `Day ${d.day}`),
      datasets: [
        {
          label: "Gravity",
          data: data.map(d => d.gravity),
        },
        {
          label: "Temp",
          data: data.map(d => d.temp),
        },
        {
          label: "pH",
          data: data.map(d => d.ph),
        }
      ]
    }
  });
}
