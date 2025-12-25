const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", loadDashboard);

function loadDashboard() {
  fetch(`${API}?action=tanks`)
    .then(res => res.json())
    .then(renderDashboard)
    .catch(err => {
      console.error("API ERROR", err);
      alert("Failed to load tanks");
    });
}

function renderDashboard(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");
  const timeline = document.getElementById("timeline");

  ferm.innerHTML = "";
  brite.innerHTML = "";
  if (timeline) timeline.innerHTML = "";

  tanks.forEach(t => {
    const status = (t.Status || "Empty")
      .toString()
      .trim()
      .toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "Empty"}</div>
    `;

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);

    if (timeline && t.Batch) {
      const tl = document.createElement("div");
      tl.className = "tank";
      tl.innerHTML = `
        <strong>${t.Batch}</strong><br>
        Tank: ${t.TankID}<br>
        Status: ${t.Status}
      `;
      timeline.appendChild(tl);
    }
  });
}
