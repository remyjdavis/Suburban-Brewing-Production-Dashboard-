document.addEventListener("DOMContentLoaded", () => {
  const API =
    "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec?action=tanks";

  fetch(API)
    .then(res => res.json())
    .then(data => renderTanks(data))
    .catch(err => {
      console.error("FETCH ERROR:", err);
      alert("Unable to load tank data.");
    });
});

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const statusRaw = (t.Status || "Empty").toString().trim();
    const status = statusRaw.toLowerCase();

    const card = document.createElement("div");
    card.className = `tank status-${status}`;

    card.innerHTML = `
      <h4>${t.TankID}</h4>
      <div><strong>Status:</strong> ${statusRaw}</div>
      <div><strong>Batch:</strong> ${t.Batch || "—"}</div>
      <div><strong>Day:</strong> ${t.Day || "—"}</div>
    `;

    card.addEventListener("click", () => {
      if (status === "empty") {
        // 👉 EMPTY TANK → Brew Log
        window.location.href = `brew-log.html?tank=${encodeURIComponent(
          t.TankID
        )}`;
      } else {
        // 👉 OCCUPIED TANK → Info only
        alert(
          `Tank: ${t.TankID}\nStatus: ${statusRaw}\nBatch: ${t.Batch || "—"}`
        );
      }
    });

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
