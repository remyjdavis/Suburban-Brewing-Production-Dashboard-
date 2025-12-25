const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tank = params.get("tank");

  if (document.getElementById("tank")) {
    document.getElementById("tank").value = tank || "";
    document.getElementById("date").valueAsDate = new Date();
    loadRecipes();
  }

  const lauterStart = document.getElementById("lauterStart");
  const lauterEnd = document.getElementById("lauterEnd");

  if (lauterStart && lauterEnd) {
    lauterStart.onchange = calcLauter;
    lauterEnd.onchange = calcLauter;
  }
});

/* ---------- RECIPES ---------- */

function loadRecipes() {
  fetch(API + "?action=recipes")
    .then(r => r.json())
    .then(recipes => {
      const sel = document.getElementById("recipe");
      sel.innerHTML = `<option value="">Select Recipe</option>`;
      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        sel.appendChild(o);
      });
      sel.onchange = () => loadRecipe(sel.value);
    });
}

function loadRecipe(id) {
  if (!id) return;

  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(data => {
      renderGrainTable(data.grain);
      fillWater(data.water);
    });
}

/* ---------- GRAIN BILL + FLAGGING ---------- */

function renderGrainTable(grains) {
  const table = document.getElementById("grain-table");
  table.innerHTML = `
    <tr>
      <th>Grain</th>
      <th>Target</th>
      <th>Actual</th>
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
    table.appendChild(row);
  });
}

function checkGrain(input) {
  const target = parseFloat(input.dataset.target);
  const actual = parseFloat(input.value);
  const row = input.closest("tr");

  if (!actual) {
    row.classList.remove("flag");
    return;
  }

  const min = target * 0.9;
  const max = target * 1.1;

  if (actual < min || actual > max) {
    row.classList.add("flag");
  } else {
    row.classList.remove("flag");
  }
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
  const s = lauterStart.value;
  const e = lauterEnd.value;
  if (!s || !e) return;

  const start = new Date(`1970-01-01T${s}`);
  const end = new Date(`1970-01-01T${e}`);
  const mins = (end - start) / 60000;

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
    koVol: koVol.value,
    koSG: koSG.value,
    koPH: koPH.value
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => alert("Brew log saved"));
}
