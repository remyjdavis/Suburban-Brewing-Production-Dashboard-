const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*********************************************************
 * INITIAL LOAD
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();
});

/*********************************************************
 * TANK LIST (MUST EXIST FOR AUTO-SELECT TO WORK)
 *********************************************************/
function populateTanks() {
  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  const tanks = ["FV-1", "FV-2", "FV-3", "FV-4", "FV-5"];

  tankSelect.innerHTML = `<option value="">Tank</option>`;

  tanks.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tankSelect.appendChild(opt);
  });
}

/*********************************************************
 * APPLY TANK FROM URL (?tank=FV-5)
 *********************************************************/
function applyTankFromURL() {
  const p = new URLSearchParams(location.search);
  const tank = p.get("tank");
  if (!tank) return;

  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  tankSelect.value = tank;
  tankSelect.dispatchEvent(new Event("change", { bubbles: true }));
}

/*********************************************************
 * AUTO-SELECT TANK FROM CLICK (PRESERVED)
 *********************************************************/
document.addEventListener("click", (e) => {
  const tankValue = e.target?.dataset?.tank;
  if (!tankValue) return;

  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  tankSelect.value = tankValue;
  tankSelect.dispatchEvent(new Event("change", { bubbles: true }));
});

/*********************************************************
 * RECIPE SELECTION (GOOGLE SHEETS – RESTORED)
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

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      // Targets
      Object.entries(d.targets || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      // Grain bill
      fillTable("grainTable", d.grain, ["Grain", "Target"]);

      // Mash schedule
      fillTable("mashTable", d.mash, ["Step", "Temp", "Time", "pH"]);

      // Water profile
      Object.entries(d.water || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    });
}

/*********************************************************
 * GENERIC TABLE FILLER
 *********************************************************/
function fillTable(id, rows = [], cols = []) {
  const tbody = document.getElementById(id);
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = cols.map(c => `<td>${r[c] ?? ""}</td>`).join("");
    tbody.appendChild(tr);
  });
}
