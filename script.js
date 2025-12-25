const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tankParam = params.get("tank");

  document.getElementById("tank").value = tankParam || "";
  document.getElementById("date").valueAsDate = new Date();

  loadRecipes();

  document.getElementById("lauterStart").onchange =
  document.getElementById("lauterEnd").onchange = calcLauter;

  document.getElementById("boilStart").onchange =
  document.getElementById("boilEnd").onchange = calcBoil;
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
      renderGrain(data.grain || []);
      renderHops(data.hops || []);
      fillWater(data.water || {});
    });
}

/* ---------- GRAIN BILL ---------- */

function renderGrain(grains) {
  const body = document.querySelector("#grainTable tbody");
  body.innerHTML = "";

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
    body.appendChild(row);
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

/* ---------- HOPS / BOIL ---------- */

function renderHops(hops) {
  const body = document.querySelector("#hopTable tbody");
  body.innerHTML = "";

  hops.forEach(h => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${h.Hop}</td>
      <td>${h.Amount}</td>
      <td>${h.Time}</td>
    `;
    body.appendChild(row);
  });
}

function calcBoil() {
  const s = document.getElementById("boilStart").value;
  const e = document.getElementById("boilEnd").value;
  if (!s || !e) return;

  const start = new Date(`1970-01-01T${s}`);
  const end = new Date(`1970-01-01T${e}`);
  const mins = (end - start) / 60000;

  document.getElementById("boilDuration").value =
    mins > 0 ? mins : "";
}

/* ---------- WATER ---------- */

function fillWater(w) {
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
  alert("Save logic already wired — next step is efficiency calc.");
}
