const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const STAGES = ["Brewed", "Fermenting", "Conditioning", "Brite", "Packaged"];

let currentBatch = "";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API}?action=tanks`)
    .then(r => r.json())
    .then(renderTanks);
});

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");
  const timeline = [];

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const card = document.createElement("div");
    card.className = `tank status-${(t.Status || "empty").toLowerCase()}`;
    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Day:</strong> ${t.Day || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "—"}</div>
    `;

    if (t.Batch) {
      card.onclick = () => openBrewLog(t.Batch, t.TankID);
      timeline.push({
        batch: t.Batch,
        tank: t.TankID,
        status: normalize(t.Status)
      });
    }

    t.Type === "Fermenter" ? ferm.appendChild(card) : brite.appendChild(card);
  });

  renderTimeline(timeline);
}

function normalize(s) {
  if (!s) return "Brewed";
  s = s.toLowerCase();
  if (s.includes("ferment")) return "Fermenting";
  if (s.includes("condition")) return "Conditioning";
  if (s.includes("brite")) return "Brite";
  if (s.includes("package")) return "Packaged";
  return "Brewed";
}

function renderTimeline(data) {
  const el = document.getElementById("timeline");
  el.innerHTML = "";

  data.forEach(b => {
    const row = document.createElement("div");
    row.className = "timeline-row";
    row.innerHTML = `<div class="timeline-label">${b.batch} (${b.tank})</div>`;
    const track = document.createElement("div");
    track.className = "timeline-track";

    STAGES.forEach(s => {
      const step = document.createElement("div");
      step.className = "timeline-step" + (s === b.status ? " active" : "");
      step.textContent = s;
      track.appendChild(step);
    });

    row.appendChild(track);
    el.appendChild(row);
  });
}

function openBrewLog(batch, tank) {
  currentBatch = batch;
  document.getElementById("log-title").textContent = `Brew Log – ${batch}`;
  document.getElementById("brew-log-modal").classList.remove("hidden");

  fetch(`${API}?action=brewlog&batch=${encodeURIComponent(batch)}`)
    .then(r => r.json())
    .then(renderLog);
}

document.getElementById("close-log").onclick = () =>
  document.getElementById("brew-log-modal").classList.add("hidden");

document.getElementById("log-form").onsubmit = e => {
  e.preventDefault();

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      BrewDate: document.getElementById("log-date").value,
      Beer: currentBatch,
      Stage: document.getElementById("log-stage").value,
      Notes: document.getElementById("log-notes").value
    })
  }).then(() => openBrewLog(currentBatch));
};

function renderLog(entries) {
  const el = document.getElementById("brew-log-entries");
  el.innerHTML = "";

  entries.forEach(e => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `<strong>${e.BrewDate}</strong><br>${e.Stage}<br><em>${e.Notes || ""}</em>`;
    el.appendChild(div);
  });
}
