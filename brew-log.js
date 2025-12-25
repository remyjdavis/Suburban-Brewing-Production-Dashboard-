const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const p = new URLSearchParams(location.search);
  if (p.get("tank")) document.getElementById("tank").value = p.get("tank");
  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(rs => {
      const s = document.getElementById("recipe");
      s.innerHTML = "<option></option>";
      rs.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        s.appendChild(o);
      });
      s.onchange = () => loadRecipe(s.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      Object.entries(d.targets).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      fill("grainTable", d.grain, ["Grain","Target"]);
      fill("mashTable", d.mash, ["Step","Temp","Time","pH"]);
      fill("hopTable", d.hops, ["Hop","Amount","Time"]);

      Object.entries(d.water).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    });
}

function fill(id, rows, cols) {
  const tb = document.querySelector(`#${id} tbody`);
  tb.innerHTML = "";
  rows.forEach(r => {
    tb.innerHTML += `<tr>${cols.map(c => `<td>${r[c]||""}</td>`).join("")}</tr>`;
  });
}
