const API_URL =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", init);

function init() {
  hydrateFromURL();
  loadRecipes();
}

function hydrateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tank = params.get("tank");
  if (tank) document.getElementById("tank").value = tank;
}

async function loadRecipes() {
  try {
    const res = await fetch(`${API_URL}?action=recipes`);
    const recipes = await res.json();

    const select = document.getElementById("recipe");
    select.innerHTML = `<option value=""></option>`;

    recipes.forEach(r => {
      const o = document.createElement("option");
      o.value = r.RecipeID;
      o.textContent = r.Beer;
      select.appendChild(o);
    });

    select.addEventListener("change", () => {
      if (select.value) loadRecipe(select.value);
    });

  } catch (err) {
    console.error("Recipe load failed", err);
  }
}

async function loadRecipe(id) {
  try {
    const res = await fetch(`${API_URL}?action=recipe&recipe=${id}`);
    const data = await res.json();

    applyValues(data.targets);
    applyValues(data.water);

    populateTable("grainTable", data.grain, ["Grain", "Target", "Milled"]);
    populateTable("mashTable", data.mash, ["Step", "Temp", "Time", "pH"]);
    populateTable("hopTable", data.hops, ["Hop", "Amount", "Time"]);

  } catch (err) {
    console.error("Recipe load failed", err);
  }
}

function applyValues(map = {}) {
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
  });
}

function populateTable(tableId, rows = [], cols = []) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  tbody.innerHTML = "";

  rows.forEach(row => {
    const tr = document.createElement("tr");
    cols.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
