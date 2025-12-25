const API = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
const STAGES = ["Brewed","Fermenting","Conditioning","Brite","Packaged"];

let currentBatch = "";
let currentBeer = "";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API}?action=tanks`).then(r=>r.json()).then(renderTanks);
});

function renderTanks(tanks){
  const ferm = fermentation;
  const brite = brite;
  const timeline = [];

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t=>{
    const card = document.createElement("div");
    card.className = `tank status-${(t.Status||"empty").toLowerCase()}`;
    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div>Batch: ${t.Batch||"—"}</div>
      <div>Status: ${t.Status||"—"}</div>
    `;

    if(t.Batch){
      card.onclick = ()=>openBrewLog(t.Batch, t.Beer||t.Batch);
      timeline.push({batch:t.Batch,tank:t.TankID,status:normalize(t.Status)});
    }

    t.Type==="Fermenter" ? ferm.appendChild(card) : brite.appendChild(card);
  });

  renderTimeline(timeline);
}

function normalize(s){
  if(!s) return "Brewed";
  s=s.toLowerCase();
  if(s.includes("ferment")) return "Fermenting";
  if(s.includes("condition")) return "Conditioning";
  if(s.includes("brite")) return "Brite";
  if(s.includes("package")) return "Packaged";
  return "Brewed";
}

function renderTimeline(data){
  timeline.innerHTML="";
  data.forEach(b=>{
    const row=document.createElement("div");
    row.className="timeline-row";
    row.innerHTML=`<strong>${b.batch} (${b.tank})</strong>`;
    const track=document.createElement("div");
    track.className="timeline-track";
    STAGES.forEach(s=>{
      const step=document.createElement("div");
      step.className="timeline-step"+(s===b.status?" active":"");
      step.textContent=s;
      track.appendChild(step);
    });
    row.appendChild(track);
    timeline.appendChild(row);
  });
}

function openBrewLog(batch, beer){
  currentBatch=batch;
  currentBeer=beer;
  log_title.textContent=`Brew Log – ${batch}`;
  brew_log_modal.classList.remove("hidden");
  fetch(`${API}?action=brewlog&batch=${encodeURIComponent(batch)}`)
    .then(r=>r.json()).then(renderLog);
}

close_log.onclick=()=>brew_log_modal.classList.add("hidden");

add_grain.onclick=()=>{
  const r=document.createElement("tr");
  r.innerHTML="<td><input></td><td><input></td>";
  grain_table.appendChild(r);
};

brewday_form.onsubmit=e=>{
  e.preventDefault();

  const grain=[...grain_table.querySelectorAll("tr")]
    .slice(1)
    .map(r=>({
      grain:r.children[0].firstChild.value,
      weight:r.children[1].firstChild.value
    }))
    .filter(g=>g.grain);

  const payload={
    BrewDate: brewday_date.value,
    Beer: currentBeer,
    Batch: currentBatch,
    Brewer: brewday_brewer.value,
    Stage: "Brew Day",
    Notes: JSON.stringify({
      grain,
      water: brewday_water.value,
      mash: brewday_mash.value,
      lauter: brewday_lauter.value,
      boil: brewday_boil.value,
      ko: brewday_ko.value
    })
  };

  fetch(API,{method:"POST",body:JSON.stringify(payload)})
    .then(()=>openBrewLog(currentBatch,currentBeer));
};

function renderLog(entries){
  brew_log_entries.innerHTML="";
  entries.forEach(e=>{
    const div=document.createElement("div");
    div.className="log-entry";

    if(e.Stage==="Brew Day"){
      const d=JSON.parse(e.Notes||"{}");
      div.innerHTML=`
        <strong>${e.BrewDate} – Brew Day</strong><br>
        Brewer: ${e.Brewer||""}<br>
        Grain Bill: ${d.grain?.map(g=>`${g.grain} (${g.weight})`).join(", ")}<br>
        Water: ${d.water||""}<br>
        Mash: ${d.mash||""}<br>
        Lauter: ${d.lauter||""}<br>
        Boil: ${d.boil||""}<br>
        KO: ${d.ko||""}
      `;
    }

    brew_log_entries.appendChild(div);
  });
}
