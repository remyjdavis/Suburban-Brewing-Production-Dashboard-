const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // Auto-fill tank from URL
  if (params.get("tank")) {
    document.getElementById("tank").value = params.get("tank");
  }

  // Default date = today
  document.getElementById("date").valueAsDate = new Date();

  loadRecipes();
});

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(res => res.json())
    .then(recipes => {
      const sel = document.getElementById("recipe");
      sel.innerHTML = `<option value=""></option>`;

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
    .then(res => res.json())
    .then(data => {
      // Targets
      Object.entries(data.targets).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });

      fillGrainTable(data.grain);
      fillMashTable(data.mash);

      // Water
      Object.entries(data.water).forEach(([k, v]) => {
        const el = document.getElementById(k);
        if (el) el.value = v;
      });
    });
}

/* ---------- Grain Bill ---------- */
function fillGrainTable(rows) {
  const tb = document.getElementById("grainTable");
  tb.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.Grain}</td>
      <td data-target="${r.Target}">${r.Target}</td>
      <td>
        <input type="number" step="0.01"
               oninput="validateMilled(this, ${r.Target})">
      </td>
    `;

    tb.appendChild(tr);
  });
}

function validateMilled(input, target) {
  const val = parseFloat(input.value);
  if (!val || !target) return;

  const min = target * 0.9;
  const max = target * 1.1;

  if (val < min || val > max) {
    input.style.border = "2px solid #d93025";
  } else {
    input.style.border = "";
  }
}

/* ---------- Mash Schedule ---------- */
function fillMashTable(rows) {
  const tb = document.getElementById("mashTable");
  tb.innerHTML = "";

  rows.forEach(step => {
    const isPHAllowed =
      step.Step.toLowerCase().includes("mash in") ||
      step.Step.toLowerCase().includes("mash out");

    tb.innerHTML += `
      <tr>
        <td>${step.Step}</td>
        <td>${step.Temp}</td>
        <td>${step.Time || ""}</td>
        <td>
          ${
            isPHAllowed
              ? `<input type="number" step="0.01">`
              : "—"
          }
        </td>
        <td><input type="time"></td>
        <td><input type="time"></td>
      </tr>
    `;
  });
}
