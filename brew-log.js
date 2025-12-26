const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const grainMilledState = {};
const mashPHState = { mashIn: "", mashOut: "" };

document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  loadRecipes();
  addBoilRow();

  document.getElementById("addBoilRow").onclick = addBoilRow;
  document.getElementById("saveBrewLog")?.addEventListener("click", saveBrewLog);

  document.getElementById("printBrewLog")?.addEventListener("click", () => {
    fillPrintHeader();
    window.print();
  });
});

function fillPrintHeader() {
  document.getElementById("printDate").textContent =
    document.getElementById("date")?.value || "—";

  document.getElementById("printTank").textContent =
    document.getElementById("tank")?.value || "—";

  const recipeSelect = document.getElementById("recipe");
  document.getElementById("printRecipe").textContent =
    recipeSelect?.selectedOptions[0]?.text || "—";

  document.getElementById("printBrewer").textContent =
    document.getElementById("brewer")?.value || "—";
}

/* ---- existing logic unchanged below ---- */

function populateTanks() {
  const tank = document.getElementById("tank");
  tank.innerHTML = `<option value="">Tank</option>`;
  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tank.appendChild(o);
  });
}

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      select.innerHTML = `<option value="">Select Recipe</option>`;
      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        select.appendChild(o);
      });
      select.onchange = () => select.value && loadRecipe(select.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      populateGrainTable(d.grain || []);
      populateMashTable(d.mash || []);
    });
}

function addBoilRow() {
  document.getElementById("boilTable").insertAdjacentHTML("beforeend", `
    <tr>
      <td><input></td>
      <td><select><option>Hop</option><option>Addition</option></select></td>
      <td><input></td>
      <td><input></td>
      <td><input></td>
    </tr>
  `);
}
