const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

/*********************************************************
 * STATE
 *********************************************************/
const grainMilledState = {};
const mashPHState = { mashIn: "", mashOut: "" };

/*********************************************************
 * INIT
 *********************************************************/
document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  loadRecipes();
  addBoilRow();

  document.getElementById("addBoilRow").onclick = addBoilRow;
  document.getElementById("saveBrewLog").onclick = saveBrewLog;
});

/*********************************************************
 * TANKS
 *********************************************************/
function populateTanks() {
  const tank = document.getElementById("tank");
  if (!tank) return;

  tank.innerHTML = `<option value="">Tank</option>`;
  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v => {
    const o = document.createElement("option");
    o.value = v;
    o.textContent = v;
    tank.appendChild(o);
  });
}

/*********************************************************
 * RECIPES
 *********************************************************/
function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r => r.json())
    .then(recipes => {
      const select = document.getElementById("recipe");
      if (!select) return;

      select.innerHTML = `<option value="">Select Recipe</option>`;
      recipes.forEach(r => {
        const o = document.createElement("option");
        o.value = r.RecipeID;
        o.textContent = r.Beer;
        select.appendChild(o);
      });

      select.onchange = () => {
        if (select.value) loadRecipe(select.value);
      };
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

/*********************************************************
 * GRAIN BILL
 *********************************************************/
function populateGrainTable(grains) {
  const tbody = document.getElementById("grainTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  grains.forEach(g => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${g.Grain}</td>
      <td>${g.Target}</td>
      <td><input type="number" step="0.01"></td>
    `;

    const input = tr.querySelector("input");
    input.value = grainMilledState[g.Grain] || "";
    input.oninput = e => grainMilledState[g.Grain] = e.target.value;

    tbody.appendChild(tr);
  });
}

/*********************************************************
 * MASH SCHEDULE (WITH MASH IN / OUT pH)
 *********************************************************/
function populateMashTable(steps) {
  const tbody = document.getElementById("mashTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  steps.forEach(s => {
    const stepName = (s.Step || "").toLowerCase();
    let phCell = "—";

    if (stepName === "mash in") {
      phCell = `<input type="number" step="0.01" value="${mashPHState.mashIn}">`;
    }

    if (stepName === "mash out") {
      phCell = `<input type="number" step="0.01" value="${mashPHState.mashOut}">`;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Step}</td>
      <td>${s.Temp}</td>
      <td>${s.Time}</td>
      <td>${phCell}</td>
      <td><input type="time"></td>
      <td><input type="time"></td>
    `;

    const phInput = tr.querySelector("td:nth-child(4) input");
    if (phInput && stepName === "mash in") {
      phInput.oninput = e => mashPHState.mashIn = e.target.value;
    }
    if (phInput && stepName === "mash out") {
      phInput.oninput = e => mashPHState.mashOut = e.target.value;
    }

    tbody.appendChild(tr);
  });
}

/*********************************************************
 * BOIL / HOPS
 *********************************************************/
function addBoilRow() {
  const tbody = document.getElementById("boilTable");
  if (!tbody) return;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input></td>
    <td>
      <select>
        <option value="Hop">Hop</option>
        <option value="Addition">Addition</option>
      </select>
    </td>
    <td><input></td>
    <td><input></td>
    <td><input></td>
  `;
  tbody.appendChild(tr);
}

function collectBoilRows() {
  const rows = [];
  document.querySelectorAll("#boilTable tr").forEach(tr => {
    const i = tr.querySelectorAll("input, select");
    if (i.length < 5) return;

    rows.push({
      Time: i[0].value,
      Type: i[1].value,
      Name: i[2].value,
      Amount: i[3].value,
      IBU: i[4].value
    });
  });
  return rows;
}

/*********************************************************
 * SAVE BREW LOG
 *********************************************************/
function collectFormData() {
  return {
    Date: document.getElementById("date")?.value || "",
    Tank: document.getElementById("tank")?.value || "",
    RecipeID: document.getElementById("recipe")?.value || "",
    Brewer: document.getElementById("brewer")?.value || "",

    GrainMilled: JSON.stringify(grainMilledState),

    MashIn_pH: mashPHState.mashIn,
    MashOut_pH: mashPHState.mashOut,

    BoilStart: document.getElementById("boilStart")?.value || "",
    BoilEnd: document.getElementById("boilEnd")?.value || "",
    PreBoilVol: document.getElementById("preBoilVol")?.value || "",
    PostBoilVol: document.getElementById("postBoilVol")?.value || "",
    BoilGravity: document.getElementById("boilGravity")?.value || "",
    TrubLoss: document.getElementById("trubLoss")?.value || "",

    BoilAdditions: JSON.stringify(collectBoilRows()),

    KOVolume: document.getElementById("koVolume")?.value || "",
    KOGravity: document.getElementById("koGravity")?.value || "",
    KOTemp: document.getElementById("koTemp")?.value || "",
    KOpH: document.getElementById("koPH")?.value || "",

    YeastStrain: document.getElementById("yeastStrain")?.value || "",
    PitchRate: document.getElementById("pitchRate")?.value || "",
    PitchTemp: document.getElementById("pitchTemp")?.value || "",
    Generation: document.getElementById("generation")?.value || "",
    Source: document.getElementById("source")?.value || ""
  };
}

function saveBrewLog() {
  const payload = collectFormData();

  fetch(`${API}?action=saveBrewLog`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
    .then(r => r.json())
    .then(res => {
      if (res.success) alert("Brew log saved 🍺");
      else alert("Save failed");
    })
    .catch(err => {
      console.error(err);
      alert("Save failed");
    });
}
