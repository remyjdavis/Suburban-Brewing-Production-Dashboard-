// Auto-select tank based on click source (PRESERVED)
document.addEventListener("click", (e) => {
  if (e.target.dataset.tank) {
    document.getElementById("tank").value = e.target.dataset.tank;
  }
});

// Populate Mash Schedule
const mashSteps = [
  { step: "Mash In", temp: "62C", time: "", ph: true },
  { step: "First Rest", temp: "62C", time: "60", ph: false },
  { step: "Mash Out", temp: "77C", time: "1", ph: true }
];

const mashTable = document.getElementById("mashTable");

mashSteps.forEach(step => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${step.step}</td>
    <td>${step.temp}</td>
    <td>${step.time}</td>
    <td>${step.ph ? `<input>` : "—"}</td>
    <td><input type="time"></td>
    <td><input type="time"></td>
  `;

  mashTable.appendChild(tr);
});

// Grain bill placeholder
const grains = ["Pilsner", "Munich"];
const grainTable = document.getElementById("grainTable");

grains.forEach(g => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${g}</td>
    <td>—</td>
    <td><input></td>
  `;
  grainTable.appendChild(tr);
});
