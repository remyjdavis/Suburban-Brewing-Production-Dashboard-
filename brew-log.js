const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*********************************************************
 * INITIAL LOAD
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();

  const printBtn = document.getElementById("printBrewLog");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }
});

/*********************************************************
 * TANK LIST
 *********************************************************/
function populateTanks() {
  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  const tanks = ["FV-1", "FV-2", "FV-3", "FV-4", "FV-5", "FV-6"];
  tankSelect.innerHTML = `<option value="">Tank</option>`;

  tanks.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tankSelect.appendChild(opt);
  });
}

/*********************************************************
 * APPLY TANK FROM URL
 *********************************************************/
function applyTankFromURL() {
  const p = new URLSearchParams(location.search);
  const tank = p.get("tank");
  if (!tank) return;

  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  tankSelect.value = tank;
}

/*********************************************************
 * LOAD RECIPES
 *********************************************************/
function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      if (!select) return;

      select.innerHTML = `<option value="">Select Recipe</option>`;

      recipes.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.RecipeID;
        opt.textContent = r.Beer;
        select.appendChild(opt);
      });

      select.onchange = () => {
        if (select.value) loadRecipe(select.value);
      };
    });
}

/*********************************************************
 * LOAD RECIPE DETAILS
 *********************************************************/
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
  if (!tbody) return;

  tbody.innerHTML = "";

  grains.forEach(g => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Target}</td>
      <td><input></td>
    `;
    tbody.appendChild(tr);
  });
}

/*********************************************************
 * MASH SCHEDULE
 *********************************************************/
function populateMashTable(steps) {
  const tbody = document.getElementById("mashTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  steps.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Step}</td>
      <td>${s.Temp}</td>
      <td>${s.Time}</td>
      <td><input></td>
      <td><input type="time"></td>
      <td><input type="time"></td>
    `;
    tbody.appendChild(tr);
  });
}
