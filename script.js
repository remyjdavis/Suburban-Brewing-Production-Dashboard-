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

/* RECIPES */

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

/* GRAIN */

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
  const t = Number(input.dataset.target);
  const a = Number(input.value);
  const row = input.closest("tr");

  if (!a) return row.classList.remove("flag");
  row.classList.toggle("flag", a < t * 0.9 || a > t * 1.1);
}

/* HOPS */

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

/* TIME CALCS */

function calcLauter() {
  lauterDuration.value = diffMinutes(lauterStart.value, lauterEnd.value);
}

function calcBoil() {
  boilDuration.value = diffMinutes(boilStart.value, boilEnd.value);
}

function diffMinutes(s, e) {
  if (!s || !e) return "";
  return (new Date(`1970-01-01T${e}`) - new Date(`1970-01-01T${s}`)) / 60000;
}

/* WATER */

function fillWater(w) {
  ca.value = w.Ca || "";
  mg.value = w.Mg || "";
  na.value = w.Na || "";
  so4.value = w.SO4 || "";
  cl.value = w.Cl || "";
  hco3.value = w.HCO3 || "";
}

function saveBrew() {
  alert("Ready for save + efficiency calc.");
}
