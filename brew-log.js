const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  tank.value = params.get("tank") || "";
  date.valueAsDate = new Date();

  loadRecipes();

  lauterStart.onchange = lauterEnd.onchange = calcLauter;
  boilStart.onchange = boilEnd.onchange = calcBoil;
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
    .then(d => {
      renderGrain(d.grain || []);
      renderMash(d.mash || []);
      renderHops(d.hops || []);
      fillWater(d.water || {});
      fillTargets(d.targets || {});
    });
}

/* ---------- TARGETS ---------- */

function fillTargets(t) {
  targetEff.value   = t.Efficiency || "";
  targetOG.value    = t.OG || "";
  targetFG.value    = t.FG || "";
  targetVol.value   = t.Volume || "";
  targetIBU.value   = t.IBU || "";
  targetColor.value = t.Color || "";
}

/* ---------- GRAIN ---------- */

function renderGrain(grains) {
  grainBody.innerHTML = "";
  grains.forEach(g => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Weight}</td>
      <td><input type="number" data-target="${g.Weight}" oninput="checkGrain(this)"></td>
    `;
    grainBody.appendChild(tr);
  });
}

function checkGrain(input) {
  const t = Number(input.dataset.target);
  const a = Number(input.value);
  input.closest("tr").classList.toggle(
    "flag",
    a && (a < t * 0.9 || a > t * 1.1)
  );
}

/* ---------- MASH ---------- */

function renderMash(steps) {
  mashBody.innerHTML = "";
  steps.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Step}</td>
      <td><input value="${s.Temp || ""}"></td>
      <td><input value="${s.Time || ""}"></td>
      <td><input value="${s.pH || ""}"></td>
    `;
    mashBody.appendChild(tr);
  });
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

/* ---------- HOPS ---------- */

function renderHops(hops) {
  hopBody.innerHTML = "";
  hops.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${h.Hop}</td>
      <td>${h.Amount}</td>
      <td>${h.Time}</td>
    `;
    hopBody.appendChild(tr);
  });
}

/* ---------- DURATIONS ---------- */

function calcLauter() {
  lauterDuration.value =
    (new Date(`1970-01-01T${lauterEnd.value}`) -
     new Date(`1970-01-01T${lauterStart.value}`)) / 60000 || "";
}

function calcBoil() {
  boilDuration.value =
    (new Date(`1970-01-01T${boilEnd.value}`) -
     new Date(`1970-01-01T${boilStart.value}`)) / 60000 || "";
}

function saveBrew() {
  alert("Save logic ready for POST");
}
