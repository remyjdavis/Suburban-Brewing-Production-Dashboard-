const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  document.getElementById("tank").value = params.get("tank") || "";
  document.getElementById("date").valueAsDate = new Date();

  loadRecipes();

  lauterStart.onchange = lauterEnd.onchange = calcLauter;
  boilStart.onchange = boilEnd.onchange = calcBoil;
});

/* ---------- RECIPES ---------- */

function loadRecipes() {
  fetch(API + "?action=recipes")
    .then(r => r.json())
    .then(data => {
      const sel = document.getElementById("recipe");
      sel.innerHTML = `<option value="">Select Recipe</option>`;
      data.forEach(r => {
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
    .then(d => {
      renderGrain(d.grain || []);
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
  const body = document.getElementById("grainBody");
  body.innerHTML = "";

  grains.forEach(g => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Weight}</td>
      <td>
        <input type="number"
               data-target="${g.Weight}"
               oninput="checkGrain(this)">
      </td>
    `;

    body.appendChild(tr);
  });
}

function checkGrain(input) {
  const target = Number(input.dataset.target);
  const actual = Number(input.value);
  const row = input.closest("tr");

  if (!actual) return row.classList.remove("flag");

  const min = target * 0.9;
  const max = target * 1.1;

  row.classList.toggle("flag", actual < min || actual > max);
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

/* ---------- BOIL ---------- */

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

/* ---------- DURATIONS ---------- */

function calcLauter() {
  if (!lauterStart.value || !lauterEnd.value) return;
  lauterDuration.value =
    (new Date(`1970-01-01T${lauterEnd.value}`) -
     new Date(`1970-01-01T${lauterStart.value}`)) / 60000;
}

function calcBoil() {
  if (!boilStart.value || !boilEnd.value) return;
  boilDuration.value =
    (new Date(`1970-01-01T${boilEnd.value}`) -
     new Date(`1970-01-01T${boilStart.value}`)) / 60000;
}

/* ---------- SAVE ---------- */

function saveBrew() {
  alert("Save wired — next step is efficiency math + POST");
}
