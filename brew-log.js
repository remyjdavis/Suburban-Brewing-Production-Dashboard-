const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  tank.value = params.get("tank") || "";
  date.valueAsDate = new Date();
  loadRecipes();
});

function loadRecipes() {
  fetch(API + "?action=recipes", { mode: "cors" })
    .then(r => r.json())
    .then(data => {
      recipe.innerHTML = `<option value="">Select Recipe</option>`;
      data.forEach(r => {
        recipe.innerHTML += `<option value="${r.RecipeID}">${r.Beer}</option>`;
      });
      recipe.onchange = () => loadRecipe(recipe.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`, { mode: "cors" })
    .then(r => r.json())
    .then(data => {
      renderGrain(data.grain || []);
      renderHops(data.hops || []);
    });
}

function renderGrain(grains) {
  const body = document.querySelector("#grainTable tbody");
  body.innerHTML = "";
  grains.forEach(g => {
    body.innerHTML += `
      <tr>
        <td>${g.Grain}</td>
        <td>${g.Weight}</td>
        <td><input type="number" oninput="checkGrain(this, ${g.Weight})"></td>
      </tr>`;
  });
}

function checkGrain(input, target) {
  const val = Number(input.value);
  const row = input.closest("tr");
  row.classList.toggle("flag", val && (val < target*0.9 || val > target*1.1));
}

function renderHops(hops) {
  const body = document.querySelector("#hopTable tbody");
  body.innerHTML = "";
  hops.forEach(h => {
    body.innerHTML += `
      <tr>
        <td>${h.Hop}</td>
        <td>${h.Amount}</td>
        <td>${h.Time}</td>
      </tr>`;
  });
}

function saveBrew() {
  alert("Save wired — next step efficiency math");
}
