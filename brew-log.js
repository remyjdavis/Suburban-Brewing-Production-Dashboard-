const API_URL =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", init);

function init() {
  hydrateFromURL();
  loadRecipes();
}

/* ---------------------------------------
   URL State
--------------------------------------- */

function hydrateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tank = params.get("tank");
  if (tank) document.getElementById("tank").value = tank;
}

/* ---------------------------------------
   Recipes
--------------------------------------- */

async function loadRecipes() {
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
}

async function loadRecipe(id) {
  const res = await fetch(`${API_URL}?action=recipe&recipe=${id}`);
  const data = await res.json();

  /* Targets */
  applyValues(data.targets);
  applyValues(data.water);

  /* Tables */
  populateGrainTable(data.grain);
  populateMashTable(data.mash);
  populateTable("hopTable", data.hops, ["Hop", "Amount", "Time"]);
}

/* ---------------------------------------
   Helpers
--------------------------------------- */

function applyValues(map = {}) {
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
  });
}

/* ---------------------------------------
   Grain Bill Logic
--------------------------------------- */

function populateGrainTable(rows = []) {
  const tbody = document.querySelector("#grainTable tbody");
  tbody.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");

    /* Grain name */
    tr.appendChild(tdText(r.Grain));

    /* Target from Google Sheets */
    tr.appendChild(tdText(r.Target));

    /* Milled input */
    const milledTd = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";

    input.addEventListener("input", () => {
      const target = parseFloat(r.Target);
      const milled = parseFloat(input.value);

      if (!isNaN(target) && !isNaN(milled)) {
        const delta = Math.abs((milled - target) / target);
        input.style.borderColor = delta > 0.10 ? "#dc2626" : "";
      } else {
        input.style.borderColor = "";
      }
    });

    milledTd.appendChild(input);
    tr.appendChild(milledTd);

    tbody.appendChild(tr);
  });
}

/* ---------------------------------------
   Mash Schedule Logic
--------------------------------------- */

function populateMashTable(rows = []) {
  const tbody = document.querySelector("#mashTable tbody");
  tbody.innerHTML = "";

  rows.forEach((r, index) => {
    const tr = document.createElement("tr");

    tr.appendChild(tdText(r.Step));
    tr.appendChild(tdText(r.Temp));
    tr.appendChild(tdText(r.Time));

    const phTd = document.createElement("td");

    /* pH input ONLY for first step and mash out */
    if (index === 0 || /out/i.test(r.Step)) {
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      phTd.appendChild(input);
    } else {
      phTd.textContent = "";
    }

    tr.appendChild(phTd);
    tbody.appendChild(tr);
  });
}

/* ---------------------------------------
   Generic Table Helper
--------------------------------------- */

function populateTable(tableId, rows = [], cols = []) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";

  rows.forEach(row => {
    const tr = document.createElement("tr");
    cols.forEach(col => tr.appendChild(tdText(row[col])));
    tbody.appendChild(tr);
  });
}

function tdText(value) {
  const td = document.createElement("td");
  td.textContent = value ?? "";
  return td;
}
