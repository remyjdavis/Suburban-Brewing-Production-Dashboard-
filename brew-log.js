const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const grainMilledState = {};

document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();
});

/*********************************************************
 * TANKS
 *********************************************************/
function populateTanks() {
  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  ["FV-1","FV-2","FV-3","FV-4","FV-5"].forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tankSelect.appendChild(opt);
  });
}

function applyTankFromURL() {
  const tank = new URLSearchParams(location.search).get("tank");
  if (!tank) return;
  const sel = document.getElementById("tank");
  if (!sel) return;
  sel.value = tank;
}

/*********************************************************
 * RECIPES
 *********************************************************/
function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      select.innerHTML = `<option value="">Select Recipe</option>`;
      recipes.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.RecipeID;
        opt.textContent = r.Beer;
        select.appendChild(opt);
      });
      select.onchange = () => loadRecipe(select.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      populateGrainTable(d.grain || []);
      populateMashTable(d.mash || []);
    });
}

/*********************************************************
 * GRAIN BILL
 *********************************************************/
function populateGrainTable(grains) {
  const tbody = document.getElementById("grainTable");
  tbody.innerHTML = "";

  grains.forEach(g => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Target}</td>
      <td><input class="sm" value="${grainMilledState[g.Grain] || ""}"></td>
    `;
    tr.querySelector("input").oninput = e => {
      grainMilledState[g.Grain] = e.target.value;
    };
    tbody.appendChild(tr);
  });
}

/*********************************************************
 * MASH SCHEDULE (pH IN CORRECT COLUMN)
 *********************************************************/
function populateMashTable(steps) {
  const tbody = document.getElementById("mashTable");
  tbody.innerHTML = "";

  steps.forEach(s => {
    const isMashPH = s.Step === "Mash in" || s.Step === "Mash out";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Step}</td>
      <td>${s.Temp}</td>
      <td>${s.Time}</td>
      <td>${isMashPH ? `<input class="sm" placeholder="pH">` : "—"}</td>
      <td><input class="md" type="time"></td>
      <td><input class="md" type="time"></td>
    `;
    tbody.appendChild(tr);
  });
}
