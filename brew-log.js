const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const p = new URLSearchParams(window.location.search);
  tank.value = p.get("tank") || "";
  date.valueAsDate = new Date();

  loadRecipes();
  lauterStart.onchange = lauterEnd.onchange = calcLauter;
  boilStart.onchange = boilEnd.onchange = calcBoil;
});

function loadRecipes() {
  fetch(API + "?action=recipes")
    .then(r => r.json())
    .then(list => {
      recipe.innerHTML = `<option value="">Select Recipe</option>`;
      list.forEach(r => {
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
  fetch(API + "?action=recipe&recipe=" + id)
    .then(r => r.json())
    .then(d => {
      renderGrain(d.grain || []);
      renderHops(d.hops || []);
      fillWater(d.water || {});
    });
}

function renderGrain(grains) {
  const b = document.querySelector("#grainTable tbody");
  b.innerHTML = "";
  grains.forEach(g => {
    const r = document.createElement("tr");
    r.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Weight}</td>
      <td><input data-target="${g.Weight}" oninput="checkGrain(this)"></td>
    `;
    b.appendChild(r);
  });
}

function checkGrain(i) {
  const t = +i.dataset.target;
  const a = +i.value;
  i.closest("tr").classList.toggle("flag", a && (a < t * .9 || a > t * 1.1));
}

function renderHops(hops) {
  const b = document.querySelector("#hopTable tbody");
  b.innerHTML = "";
  hops.forEach(h => {
    const r = document.createElement("tr");
    r.innerHTML = `<td>${h.Hop}</td><td>${h.Amount}</td><td>${h.Time}</td>`;
    b.appendChild(r);
  });
}

function calcLauter() {
  lauterDuration.value = diff(lauterStart.value, lauterEnd.value);
}
function calcBoil() {
  boilDuration.value = diff(boilStart.value, boilEnd.value);
}
function diff(s, e) {
  if (!s || !e) return "";
  return (new Date(`1970-01-01T${e}`) - new Date(`1970-01-01T${s}`)) / 60000;
}

function fillWater(w) {
  ca.value = w.Ca || "";
  mg.value = w.Mg || "";
  na.value = w.Na || "";
  so4.value = w.SO4 || "";
  cl.value = w.Cl || "";
  hco3.value = w.HCO3 || "";
}

function saveBrew() {
  alert("Save wired – next phase is efficiency + persistence.");
}
