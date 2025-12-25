const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${API}?action=tanks`)
    .then(res => res.json())
    .then(renderDashboard)
    .catch(err => console.error(err));
});

function renderDashboard(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");
  const timeline = document.getElementById("timeline");

  ferm.innerHTML = "";
  brite.innerHTML = "";
  timeline.innerHTML = "";

  const activeBatches = [];

  tanks.forEach(t => {
    const status = (t.Status || "empty").toLowerCase();
    const card = document.createElement("div");
    card.className = `tank status-${status}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "Empty"}</div>
    `;

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);

    if (t.Batch) activeBatches.push(t);
  });

  renderTimeline(activeBatches);
}

function renderTimeline(batches) {
  if (!batches.length) {
    timeline.innerHTML = "<em>No active batches</em>";
    return;
  }

  batches.forEach(b => {
    const div = document.createElement("div");
    div.className = "tank";
    div.innerHTML = `
      <strong>${b.Batch}</strong><br>
      Tank: ${b.TankID}<br>
      Status: ${b.Status}
    `;
    timeline.appendChild(div);
  });
}
