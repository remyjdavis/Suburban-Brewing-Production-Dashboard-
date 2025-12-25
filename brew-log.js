const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tank = params.get("tank");
  if (tank) document.getElementById("tank").value = tank;

  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      select.innerHTML = "<option></option>";

      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        select.appendChild(o);
      });

      select.onchange = () => loadRecipe(select.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {

      Object.entries(d.targets || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      fillGrain(d.grain || []);
      fillMash(d.mash || []);

      Object.entries(d.water || {}).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    });
}

function fillGrain(rows) {
  const tb = document.getElementById("grainTable");
  tb.innerHTML = "";

  rows.forEach(r => {
    tb.innerHTML += `
      <tr>
        <td>${r.Grain}</td>
        <td>${r.Target}</td>
        <td><input type="number" step="0.01"></td>
      </tr>
    `;
  });
}

function fillMash(rows) {
  const tb = document.getElementById("mashTable");
  tb.innerHTML = "";

  rows.forEach((r, i) => {
    const phAllowed =
      i === 0 || r.Step.toLowerCase().includes("out");

    tb.innerHTML += `
      <tr>
        <td>${r.Step}</td>
        <td>${r.Temp}</td>
        <td>${r.Time}</td>
        <td>${phAllowed ? `<input step="0.01">` : "—"}</td>
        <td><input type="time"></td>
        <td><input type="time"></td>
      </tr>
    `;
  });
}
