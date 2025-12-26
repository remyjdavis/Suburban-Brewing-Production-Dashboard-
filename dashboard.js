const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.addEventListener("DOMContentLoaded", loadTanks);

function loadTanks() {
  fetch(`${API}?action=tanks&_=${Date.now()}`)
    .then(res => res.json())
    .then(renderTanks)
    .catch(err => console.error("Tank load failed:", err));
}

function renderTanks(tanks) {
  const fermentation = document.getElementById("fermentation");
  const brite = document.getElementById("brite");

  fermentation.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(t => {
    const status = (t.Status || "AVAILABLE").toUpperCase();
    const isFV = t.TankID.startsWith("FV");

    const card = document.createElement("div");
    card.className = `tank status-${status.toLowerCase()}`;

    card.onclick = () => {
      const params = new URLSearchParams({
        tank: t.TankID,
        brewId: t.ActiveBrewID || ""
      });

      if (status === "FERMENTING") {
        window.location.href = `fermentation.html?${params}`;
      } else {
        window.location.href = `brew-log.html?${params}`;
      }
    };

    card.innerHTML = `
      <div class="tank-header">
        <span class="tank-id">${t.TankID}</span>
        <span class="tank-badge">${status}</span>
      </div>
      <div class="tank-details">
        <div><strong>Active Brew:</strong> ${t.ActiveBrewID || "—"}</div>
        <div><strong>Last Brew:</strong> ${t.LastBrewDate || "—"}</div>
      </div>
    `;

    (isFV ? fermentation : brite).appendChild(card);
  });
}
