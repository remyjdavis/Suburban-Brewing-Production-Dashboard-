const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  if (params.get("tank")) {
    document.getElementById("tank").value = params.get("tank");
  }

  document.getElementById("date").valueAsDate = new Date();
  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const sel = document.getElementById("recipe");
      sel.innerHTML = `<option></option>`;
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
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {

      Object.entries(d.targets).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      // Grain Bill
      const gtb = document.querySelector("#grainTable tbody");
      gtb.innerHTML = "";
      d.grain.forEach(g => {
        gtb.innerHTML += `
          <tr>
            <td>${g.Grain}</td>
            <td>${g.Target}</td>
            <td><input type="number" step="0.01"></td>
          </tr>`;
      });

      // Mash Tun with Start/End + pH logic
      const mtb = document.querySelector("#mashTable tbody");
      mtb.innerHTML = "";
      d.mash.forEach(m => {
        const phEditable =
          m.Step.toLowerCase().includes("mash in") ||
          m.Step.toLowerCase().includes("mash out");

        mtb.innerHTML += `
          <tr>
            <td>${m.Step}</td>
            <td>${m.Temp}</td>
            <td>${m.Time}</td>
            <td><input type="time"></td>
            <td><input type="time"></td>
            <td>${phEditable ? `<input>` : "—"}</td>
          </tr>`;
      });

      // Water
      Object.entries(d.water).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    });
}
