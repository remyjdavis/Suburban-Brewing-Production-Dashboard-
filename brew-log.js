const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  populateTanks();
  applyTankFromURL();
  loadRecipes();

  const printBtn = document.getElementById("printBrewLog");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }
});

function populateTanks() {
  const t = document.getElementById("tank");
  ["FV-1","FV-2","FV-3","FV-4","FV-5","FV-6"].forEach(v=>{
    const o=document.createElement("option");
    o.value=v; o.textContent=v;
    t.appendChild(o);
  });
}

function applyTankFromURL() {
  const p = new URLSearchParams(location.search);
  const tank = p.get("tank");
  if (tank) document.getElementById("tank").value = tank;
}

function loadRecipes() {
  fetch(`${API}?action=recipes`)
    .then(r=>r.json())
    .then(d=>{
      const s=document.getElementById("recipe");
      d.forEach(r=>{
        const o=document.createElement("option");
        o.value=r.RecipeID;
        o.textContent=r.Beer;
        s.appendChild(o);
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
  const t=document.getElementById("grainTable");
  t.innerHTML="";
  grains.forEach(g=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${g.Grain}</td><td>${g.Target}</td><td><input></td>`;
    t.appendChild(tr);
  });
}

function populateMashTable(steps) {
  const t=document.getElementById("mashTable");
  t.innerHTML="";
  steps.forEach(s=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${s.Step}</td>
      <td>${s.Temp}</td>
      <td>${s.Time}</td>
      <td><input></td>
      <td><input type="time"></td>
      <td><input type="time"></td>
    `;
    t.appendChild(tr);
  });
}
