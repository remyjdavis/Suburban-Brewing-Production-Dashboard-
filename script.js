document.addEventListener("DOMContentLoaded", () => {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec?action=tanks";

  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderTanks(data))
    .catch(err => console.error("FETCH ERROR:", err));
});

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

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

    card.addEventListener("click", () => {
      alert(
        `Tank: ${t.TankID}\nStatus: ${t.Status}\nBatch: ${t.Batch || "—"}`
      );
    });

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
