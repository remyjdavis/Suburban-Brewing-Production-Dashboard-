const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tankParam = params.get("tank");

  if (tank) {
    tank.value = tankParam || "";
    date.valueAsDate = new Date();
    loadRecipes();
  }

  lauterStart.onchange = lauterEnd.onchange = calcLauter;
});

/* ---------- RECIPES ---------- */

function loadRecipes() {
  fetch(API + "?action=recipes")
    .then(r => r.json())
    .then(recipes => {
      recipe.innerHTML = `<option value="">Select Recipe</option>`;
      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        recipe.appendChild(o);
      });
      recipe.onchange = () => loadRecipe(recipe.value);
    });
}

function loadRecipe(id) {
  if (!id) return;

  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(data => {
      renderGrainTable(data.grain);
      renderHopTable(data.hops);
      fillWater(data.water);
    });
}

/* ---------- GRAIN BILL ---------- */

function renderGrainTable(grains) {
  grainTable.innerHTML = `
    <tr>
      <th>Grain</th>
      <th>Target</th>
      <th>Milled</th>
    </tr>
  `;

  grains.forEach(g => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Weight}</td>
      <td>
        <input type="number"
          data-target="${g.Weight}"
          oninput="checkGrain(this)">
      </td>
    `;
    grainTable.appendChild(row);
  });
}

function checkGrain(input) {
  const target = Number(input.dataset.target);
  const actual = Number(input.value);
  const row = input.closest("tr");

  if (!actual) {
    row.classList.remove("flag");
    return;
  }

  const min = target * 0.9;
  const max = target * 1.1;

  row.classList.toggle("flag", actual < min || actual > max);
}

/* ---------- HOPS ---------- */

function renderHopTable(hops) {
  hopTable.innerHTML = `
    <tr>
      <th>Hop</th>
      <th>Amount</th>
      <th>Time</th>
      <th>Use</th>
    </tr>
  `;

  hops.forEach(h => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${h.Hop}</td>
      <td>${h.Amount}</td>
      <td>${h.Time}</td>
      <td>${h.Use}</td>
    `;
    hopTable.appendChild(row);
  });
}

/* ---------- WATER ---------- */

function fillWater(w) {
  if (!w) return;
  ca.value = w.Ca || "";
  mg.value = w.Mg || "";
  na.value = w.Na || "";
  so4.value = w.SO4 || "";
  cl.value = w.Cl || "";
  hco3.value = w.HCO3 || "";
}

/* ---------- LAUTER ---------- */

function calcLauter() {
  if (!lauterStart.value || !lauterEnd.value) return;
  const s = new Date(`1970-01-01T${lauterStart.value}`);
  const e = new Date(`1970-01-01T${lauterEnd.value}`);
  const mins = (e - s) / 60000;
  lauterDuration.value = mins > 0 ? mins : "";
}

/* ---------- SAVE ---------- */

function saveBrew() {
  const payload = {
    tank: tank.value,
    recipe: recipe.value,
    brewer: brewer.value,
    date: date.value,
    mashPH: mashPH.value,
    firstRun: firstRun.value,
    finalRun: finalRun.value,
    lauterStart: lauterStart.value,
    lauterEnd: lauterEnd.value,
    lauterDuration: lauterDuration.value,
    boilTime: boilTime.value,
    koVol: koVol.value,
    koSG: koSG.value,
    koPH: koPH.value
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => alert("Brew log saved"));
}
