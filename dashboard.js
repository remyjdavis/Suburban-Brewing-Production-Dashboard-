const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  fetch(API + "?action=tanks")
    .then(res => res.json())
    .then(renderTanks)
    .catch(err => console.error(err));
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
      <div><strong>Status:</strong> ${t.Status || "Empty"}</div>
    `;

    card.onclick = () => {
      if (status === "empty") {
        window.location.href = `brew-log.html?tank=${t.TankID}`;
      }
    };

    if (t.Type === "Fermenter") ferm.appendChild(card);
    if (t.Type === "Brite") brite.appendChild(card);
  });
}
