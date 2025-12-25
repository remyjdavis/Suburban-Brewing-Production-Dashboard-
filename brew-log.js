// Placeholder recipe data – will be replaced by Google Sheets pull
const recipeData = {
  grains: [
    { name: "Pilsner", target: 100 },
    { name: "Munich", target: 20 }
  ],
  mash: [
    { step: "Mash In", temp: "62C", time: "", ph: true },
    { step: "Rest", temp: "62C", time: "60", ph: false },
    { step: "Mash Out", temp: "77C", time: "1", ph: true }
  ]
};

// Populate Grain Bill
const grainBody = document.querySelector("#grainTable tbody");
recipeData.grains.forEach(g => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${g.name}</td>
    <td>${g.target}</td>
    <td><input data-target="${g.target}"></td>
  `;
  grainBody.appendChild(row);
});

// Grain validation ±10%
grainBody.addEventListener("input", e => {
  if (!e.target.dataset.target) return;
  const target = Number(e.target.dataset.target);
  const val = Number(e.target.value);
  if (val < target * 0.9 || val > target * 1.1) {
    e.target.classList.add("mismatch");
  } else {
    e.target.classList.remove("mismatch");
  }
});

// Mash Schedule
const mashBody = document.querySelector("#mashTable tbody");
recipeData.mash.forEach(m => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${m.step}</td>
    <td>${m.temp}</td>
    <td>${m.time}</td>
    <td><input ${m.ph ? "" : "readonly"}></td>
  `;
  mashBody.appendChild(row);
});
