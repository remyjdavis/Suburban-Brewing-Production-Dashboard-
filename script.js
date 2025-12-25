const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", loadDashboard);

function loadDashboard() {
  fetch(`${API}?action=tanks`)
    .then(res => res.json())
    .then(data => {
      console.log("TANK DATA", data); // debug-safe
      renderDashboard(data);
    })
    .catch(err => console.error("API ERROR", err));
}

function renderDashboard(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const type = (t.Type || "").toString().toLowerCase();
    const status = (t.Status || "Empty").toString().toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Day:</strong> ${t.Day || "—"}</div>
      <div><strong>Status:</strong> ${t.Status || "Empty"}</div>
    `;

    if (type === "fermenter") {
      ferm.appendChild(card);
    } else if (type === "brite") {
      brite.appendChild(card);
    }
  });
}
