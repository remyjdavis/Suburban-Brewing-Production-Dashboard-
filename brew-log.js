const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  document.getElementById("tank").value = params.get("tank") || "";
  document.getElementById("date").valueAsDate = new Date();

  loadRecipes();
  wireDurations();
});

/* ---------- RECIPES ---------- */

function loadRecipes() {
  fetch(API + "?action=recipes", { mode: "cors" })
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

  fetch(`${API}?action=recipe&recipe=${id}`, { mode: "cors" })
    .then(r => r.json())
    .then(data => {
      renderGrains(data.grain || []);
      renderHops(data.hops || []);
      renderWater(data.water || {});
    });
}

/* ---------- GRAIN ---------- */

function renderGrains(grains) {
  const body = document.getElementById("grainBody");
  body.innerHTML = "";

  grains.forEach(g => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Weight}</td>
      <td><input type="number"></td>
    `;

    body.appendChild(tr);
  });
}

/* ---------- HOPS ---------- */

function renderHops(hops) {
  const body = document.getElementById("hopBody");
  body.innerHTML = "";

  hops.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${h.Hop}</td>
      <td>${h.Amount}</td>
      <td>${h.Time}</td>
    `;
    body.appendChild(tr);
  });
}

/* ---------- WATER ---------- */

function renderWater(w) {
  ["Ca", "Mg", "Na", "SO4", "Cl", "HCO3"].forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = w[k] || "";
  });
}

/* ---------- TIME MATH ---------- */

function wireDurations() {
  ["lauter", "boil"].forEach(p => {
    const s = document.getElementById(p + "Start");
    const e = document.getElementById(p + "End");
    const d = document.getElementById(p + "Duration");

    if (!s || !e || !d) return;

    const calc = () => {
      if (!s.value || !e.value) return;
