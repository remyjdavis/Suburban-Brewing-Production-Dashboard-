const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

console.log("DASHBOARD JS LOADED", Date.now());

document.addEventListener("DOMContentLoaded", () => {
  const fermenters = document.getElementById("fermenters");
  const brites = document.getElementById("brites");

  if (!fermenters || !brites) {
    console.error("Dashboard containers missing");
    return;
  }

  fetch(`${API}?action=tanks&_=${Date.now()}`)
    .then(res => res.json())
    .then(tanks => {
      console.table(tanks);

      fermenters.innerHTML = "";
      brites.innerHTML = "";

      tanks.forEach(t => {
        const id = String(t.TankID || "").trim().toUpperCase();
        const status = String(t.Status || "AVAILABLE").toUpperCase();

        const card = document.createElement("div");
        card.className = "card clickable";

        card.innerHTML = `
          <div class="tank-id">${id || "—"}</div>
          <div class="status ${status.replace(/\s+/g, "-")}">${status}</div>
          <div class="meta">
            <strong>Active Brew:</strong> ${t.ActiveBrewID || "—"}<br>
            <strong>Last Brew:</strong> ${t.LastBrewDate || "—"}
          </div>
        `;

        // CLICK ROUTING
        card.onclick = () => {
          const params = new URLSearchParams({
            tank: id,
            brewId: t.ActiveBrewID || ""
          });

          if (status.includes("FERMENT")) {
            window.location.href =
              "fermentation.html?" + params.toString();
          } else {
            window.location.href =
              "brew-log.html?" + params.toString();
          }
        };

        // ✅ FIXED BUCKETING LOGIC
        if (status.includes("FERMENT")) {
          fermenters.appendChild(card);
        } else {
          brites.appendChild(card);
        }
      });
    })
    .catch(err => {
      console.error("Dashboard load failed:", err);
    });
});
