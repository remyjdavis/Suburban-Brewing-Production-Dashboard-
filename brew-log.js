const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*********************************************************
 * STATE
 *********************************************************/
const grainMilledState = {}; // preserves milled input per grain name

/*********************************************************
 * INITIAL LOAD
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();
});

/*********************************************************
 * TANK LIST
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
 * AUTO-SELECT TANK FROM CLICK
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
 * RECIPE SELECTION
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
    })
    .catch(err => console.error("Recipe load error:", err));
}

/*********************************************************
 * LOAD RECIPE DETAILS
 *********************************************************/
function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      // Targets
      Object.entries(d.targets || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      // Grain Bill
      populateGrainTable(d.grain || []);

      // Mash Schedule
      populateMashTable(d.mash || []);

      // Water Profile
      Object.entries(d.water || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    })
    .catch(err => console.error("Recipe detail error:", err));
}

/*********************************************************
 * GRAIN BILL (TARGET + MILLED INPUT)
 *********************************************************/
function populateGrainTable(grains) {
  const tbody = document.getElementById("grainTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  grains.forEach(g => {
    const grainName = g.Grain ?? "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${grainName}</td>
      <td>${g.Target ?? ""}</td>
      <td>
        <input
          class="sm"
          placeholder="Milled"
          value="${grainMilledState[grainName] ?? ""}"
        >
      </td>
    `;

    const input = tr.querySelector("input");
    input.addEventListener("input", () => {
      grainMilledState[grainName] = input.value;
    });

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
      <td>${s.Step ?? ""}</td>
      <td>${s.Temp ?? ""}</td>
      <td>${s.Time ?? ""}</td>
      <td>${s.pH ? `<input class="xs">` : "—"}</td>
      <td><input class="md" type="time"></td>
      <td><input class="md" type="time"></td>
    `;
    tbody.appendChild(tr);
  });
}
