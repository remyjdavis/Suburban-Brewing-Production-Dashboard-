const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", () => {
  loadTanks();
});

function loadTanks() {
  fetch(`${API}?action=tanks`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Accept": "application/json"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(tanks => {
      console.log("TANKS LOADED:", tanks);
      renderTanks(tanks);
    })
    .catch(error => {
      console.error("SAFARI FETCH ERROR:", error);
    });
}

function renderTanks(tanks) {
  const ferm = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  if (!ferm || !brite) {
    console.error("Missing container elements");
    return;
  }

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const type = (t.Type || "").toString().trim().toLowerCase();
    const status = (t.Status || "empty").toString().trim().toLowerCase();

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
