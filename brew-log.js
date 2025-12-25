const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const grainMilledState = {};
const mashPHState = { mashIn: "", mashOut: "" };

document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  loadRecipes();
  addBoilRow();
  document.getElementById("addBoilRow").onclick = addBoilRow;
});

function populateTanks() {
  const t = document.getElementById("tank");
  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v=>{
    const o=document.createElement("option");o.value=v;o.text=v;t.appendChild(o);
  });
}

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r=>r.json())
    .then(d=>{
      const s=document.getElementById("recipe");
      d.forEach(r=>{
        const o=document.createElement("option");
        o.value=r.RecipeID;o.text=r.Beer;s.appendChild(o);
      });
      s.onchange=()=>loadRecipe(s.value);
    });
}

function loadRecipe(id) {
  fetch(`${API}?action=recipe&recipe=${id}`)
    .then(r=>r.json())
    .then(d=>{
      populateGrainTable(d.grain||[]);
      populateMashTable(d.mash||[]);
    });
}

function populateGrainTable(grains) {
  const t=document.getElementById("grainTable");t.innerHTML="";
  grains.forEach(g=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${g.Grain}</td><td>${g.Target}</td><td><input></td>`;
    tr.querySelector("input").value=grainMilledState[g.Grain]||"";
    tr.querySelector("input").oninput=e=>grainMilledState[g.Grain]=e.target.value;
    t.appendChild(tr);
  });
}

function populateMashTable(steps) {
  const t=document.getElementById("mashTable");t.innerHTML="";
  steps.forEach(s=>{
    const name=s.Step.toLowerCase();
    let ph="—";
    if(name==="mash in") ph=`<input value="${mashPHState.mashIn}">`;
    if(name==="mash out") ph=`<input value="${mashPHState.mashOut}">`;
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${s.Step}</td><td>${s.Temp}</td><td>${s.Time}</td><td>${ph}</td><td><input></td><td><input></td>`;
    const p=tr.querySelector("td:nth-child(4) input");
    if(p && name==="mash in") p.oninput=e=>mashPHState.mashIn=e.target.value;
    if(p && name==="mash out") p.oninput=e=>mashPHState.mashOut=e.target.value;
    t.appendChild(tr);
  });
}

function addBoilRow() {
  const t=document.getElementById("boilTable");
  const tr=document.createElement("tr");
  tr.innerHTML=`
    <td><input></td>
    <td><select><option>Hop</option><option>Addition</option></select></td>
    <td><input></td>
    <td><input></td>
    <td><input></td>
  `;
  t.appendChild(tr);
}
