const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*********************************************************
 * STATE
 *********************************************************/
const grainMilledState = {};
const mashPHState = {
  mashIn: "",
  mashOut: ""
};

/*********************************************************
 * INITIAL LOAD
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();
});

/*********************************************************
 * TANK LIST (6 TANKS)
 *********************************************************/
function populateTanks() {
  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  const tanks = ["FV-1", "FV-2", "FV-3", "FV-4", "FV-5", "FV-6"];

  tankSelect.innerHTML = `<option value="">Tank</option>`;

  tanks.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tankSelect.appendChild(opt);
  });
}

/*********************************************************
 * APPLY TANK FROM URL (?tank=FV-5)
 *********************************************************/
function applyTankFromURL() {
  const p = new URLSearchParams(location.search);
  const tank = p.get("tank");
  if (!tank) return;

  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  tankSelect.value = tank;
}

/*********************************************************
 * RECIPE SELECTION
 *********************************************************/
function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      if (!select) return;

      select.innerHTML = `<option value="">Select Recipe</option>`;

      recipes.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.RecipeID;
        opt.textContent = r.Beer;
        select.appendChild(opt);
      });

      select.onchange = () => {
        if (select.value) loadRecipe(select.value);
      };
    })
    .catch(err => console.error("Recipe load error:", err));
}

/*********************************************************
 * LOAD RECIPE DETAILS
 *********************************************************/
function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r => r.json())
    .then(d => {
      populateGrainTable(d.grain || []);
      populateMashTable(d.mash || []);
    })
    .catch(err => console.error("Recipe detail error:", err));
}

/*********************************************************
 * GRAIN BILL (TARGET + MILLED)
 *********************************************************/
function populateGrainTable(grains) {
  const tbody = document.getElementById("grainTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  grains.forEach(g => {
    const name = g.Grain ?? "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${name}</td>
      <td>${g.Target ?? ""}</td>
      <td>
        <input
          class="sm"
          placeholder="Milled"
          value="${grainMilledState[name] ?? ""}"
        >
      </td>
    `;

    tr.querySelector("input").oninput = e => {
      grainMilledState[name] = e.target.value;
    };

    tbody.appendChild(tr);
  });
}

/*********************************************************
 * MASH SCHEDULE
 * pH input ONLY for Mash in + Mash out
 *********************************************************/
function populateMashTable(steps) {
  const tbody = document.getElementById("mashTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  steps.forEach(s => {
    const stepName = (s.Step || "").toLowerCase();
    const isMashIn = stepName === "mash in";
    const isMashOut = stepName === "mash out";

    let phCell = "—";

    if (isMashIn) {
      phCell = `
        <input
          class="sm"
          placeholder="pH"
          value="${mashPHState.mashIn}"
        >
      `;
    }

    if (isMashOut) {
      phCell = `
        <input
          class="sm"
          placeholder="pH"
          value="${mashPHState.mashOut}"
        >
      `;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Step ?? ""}</td>
      <td>${s.Temp ?? ""}</td>
      <td>${s.Time ?? ""}</td>
      <td>${phCell}</td>
      <td><input class="md" type="time"></td>
      <td><input class="md" type="time"></td>
    `;

    const phInput = tr.querySelector("td:nth-child(4) input");
    if (phInput && isMashIn) {
      phInput.oninput = e => mashPHState.mashIn = e.target.value;
    }
    if (phInput && isMashOut) {
      phInput.oninput = e => mashPHState.mashOut = e.target.value;
    }

    tbody.appendChild(tr);
  });
}
