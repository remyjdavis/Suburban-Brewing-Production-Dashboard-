const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // ✅ Auto-fill Tank from URL (?tank=FV-5)
  const tank = params.get("tank");
  if (tank) {
    const tankInput = document.getElementById("tank");
    if (tankInput) tankInput.value = tank;
  }

  // Default date to today
  const dateInput = document.getElementById("date");
  if (dateInput && !dateInput.value) {
    dateInput.valueAsDate = new Date();
  }

  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      select.innerHTML = `<option value="">Select recipe</option>`;

      recipes.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.RecipeID;
        opt.textContent = r.Beer;
        select.appendChild(opt);
      });

      select.addEventListener("change", () => {
        if (select.value) loadRecipe(select.value);
      });
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(data => {

      // Targets
      Object.entries(data.targets || {}).forEach(([key, val]) => {
        const el = document.getElementById(key);
        if (el) el.value = val;
      });

      fillTable("grainTable", data.grain, ["Grain", "Target", "Milled"]);
      fillTable("mashTable", data.mash, ["Step", "Temp", "Time", "pH"]);

      // Water
      Object.entries(data.water || {}).forEach(([key, val]) => {
        const el = document.getElementById(key.toLowerCase());
        if (el) el.value = val;
      });
    });
}

function fillTable(id, rows = [], cols = []) {
  const tbody = document.querySelector(`#${id} tbody`);
  tbody.innerHTML = "";

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${cols.length}" class="muted">— No data loaded —</td></tr>`;
    return;
  }

  rows.forEach(r => {
    const tr = document.createElement("tr");
    cols.forEach(c => {
      const td = document.createElement("td");
      td.textContent = r[c] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
