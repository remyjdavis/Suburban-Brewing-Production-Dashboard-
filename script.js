const API_BASE =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

const STAGES = [
  "Brewed",
  "Fermenting",
  "Conditioning",
  "Brite",
  "Packaged"
];

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API_BASE}?action=tanks`)
    .then(res => res.json())
    .then(data => renderTanks(data))
    .catch(err => console.error(err));
});

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");
  const timelineData = [];

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const status = (t.Status || "empty").toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Day:</strong> ${t.Day || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "—"}</div>
    `;

    if (t.Batch && t.Status !== "Empty") {
      timelineData.push({
        batch: t.Batch,
        tank: t.TankID,
        status: normalizeStatus(t.Status)
      });

      card.addEventListener("click", () => openBrewLog(t.Batch));
    }

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });

  renderTimeline(timelineData);
}

function normalizeStatus(status) {
  const s = status.toLowerCase();
  if (s.includes("ferment")) return "Fermenting";
  if (s.includes("condition")) return "Conditioning";
  if (s.includes("brite")) return "Brite";
  if (s.includes("package")) return "Packaged";
  return "Brewed";
}

function renderTimeline(batches) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  batches.forEach(b => {
    const row = document.createElement("div");
    row.className = "timeline-row";

    row.innerHTML = `<div class="timeline-label">${b.batch} (${b.tank})</div>`;

    const track = document.createElement("div");
    track.className = "timeline-track";

    STAGES.forEach(stage => {
      const step = document.createElement("div");
      step.className = "timeline-step";
      if (stage === b.status) step.classList.add("active");
      step.textContent = stage;
      track.appendChild(step);
    });

    row.appendChild(track);
    container.appendChild(row);
  });
}

function openBrewLog(batch) {
  document.getElementById("brew-log-modal").classList.remove("hidden");
  document.getElementById("log-title").textContent = `Brew Log – ${batch}`;

  fetch(`${API_BASE}?action=brewlog&batch=${encodeURIComponent(batch)}`)
    .then(res => res.json())
    .then(data => renderBrewLog(data));
}

document.getElementById("close-log").onclick = () => {
  document.getElementById("brew-log-modal").classList.add("hidden");
};

function renderBrewLog(entries) {
  const container = document.getElementById("brew-log-entries");
  container.innerHTML = "";

  if (!entries.length) {
    container.innerHTML = "<em>No log entries yet.</em>";
    return;
  }

  entries.forEach(e => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `
      <strong>${e.BrewDate}</strong><br>
      ${e.Stage}<br>
      <em>${e.Notes || ""}</em>
    `;
    container.appendChild(div);
  });
}
