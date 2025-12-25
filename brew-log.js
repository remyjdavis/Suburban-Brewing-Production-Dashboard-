const API = "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  date.valueAsDate = new Date();
  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(data => {
      recipe.innerHTML = `<option value="">Select Recipe</option>`;
      data.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        recipe.appendChild(o);
      });
      recipe.onchange = () => loadRecipe(recipe.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      fillTargets(d.targets);
      renderGrain(d.grain);
      renderMash(d.mash);
      renderHops(d.hops);
      fillWater(d.water);
    });
}

/* ---------- TARGETS ---------- */
function fillTargets(t) {
  targetEff.value   = t.Efficiency || "";
  targetOG.value    = t.TargetOG || "";
  targetFG.value    = t.TargetFG || "";
  targetVol.value   = t.TargetVolume || "";
  targetIBU.value   = t.IBU || "";
  targetColor.value = t.SRM || "";
}

/* ---------- GRAIN ---------- */
function renderGrain(rows) {
  grainBody.innerHTML = "";
  rows.forEach(r => {
    grainBody.innerHTML += `
      <tr>
        <td>${r.Grain}</td>
        <td>${r.Weight}</td>
        <td><input></td>
      </tr>`;
  });
}

/* ---------- MASH ---------- */
function renderMash(rows) {
  mashBody.innerHTML = "";
  rows.forEach(r => {
    mashBody.innerHTML += `
      <tr>
        <td>${r.Step}</td>
        <td><input value="${r.Temp}"></td>
        <td><input value="${r.Time}"></td>
        <td><input value="${r.pH || ""}"></td>
      </tr>`;
  });
}

/* ---------- WATER ---------- */
function fillWater(w) {
  ca.value   = w.Ca || "";
  mg.value   = w.Mg || "";
  na.value   = w.Na || "";
  so4.value  = w.SO4 || "";
  cl.value   = w.Cl || "";
  hco3.value = w.HCO3 || "";
}

/* ---------- HOPS ---------- */
function renderHops(rows) {
  hopBody.innerHTML = "";
  rows.forEach(r => {
    hopBody.innerHTML += `
      <tr>
        <td>${r.Hop}</td>
        <td>${r.Amount}</td>
        <td>${r.Time}</td>
      </tr>`;
  });
}
