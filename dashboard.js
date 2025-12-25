const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", loadTanks);

function loadTanks() {
  fetch(`${API}?action=tanks`)
    .then(r => r.json())
    .then(data => {
      // SAFETY: normalize to array
      const tanks = Array.isArray(data) ? data : data.tanks || [];

      renderTanks(tanks);
    })
    .catch(err => console.error("Tank fetch error:", err));
}

function renderTanks(tanks) {
  const ferm = document.getElementById("fermTanks");
  const brite = document.getElementById("briteTanks");

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const status = (t.Status || "empty").toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;
    card.innerHTML = `
      <h4>${t.TankID || "—"}</h4>
      <div><strong>Status:</strong> ${t.Status || "—"}</div>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
    `;

    // ONLY empty tanks go to brew log
    if (status === "empty") {
      card.onclick = () =>
        window.location.href = `brew-log.html?tank=${t.TankID}`;
    }

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
