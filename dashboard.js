const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

fetch(API + "?action=tanks")
  .then(res => res.json())
  .then(tanks => {
    if (!Array.isArray(tanks)) return;

    const fermentation = document.getElementById("fermentation");
    const brite = document.getElementById("brite");

    fermentation.innerHTML = "";
    brite.innerHTML = "";

    tanks.forEach(t => {
      const status = (t.Status || "Empty").toLowerCase();

      const card = document.createElement("div");
      card.className = "tank status-" + status;

      /* CLICK — ALWAYS WORKS */
      card.addEventListener("click", () => {
        const params = new URLSearchParams({
          tank: t.TankID || "",
          beer: t.Beer || "",
          batch: t.Batch || ""
        });
        window.location.href = "brew-log.html?" + params.toString();
      });

      const header = document.createElement("div");
      header.className = "tank-header";

      const tankId = document.createElement("span");
      tankId.className = "tank-id";
      tankId.textContent = t.TankID || "—";

      const badge = document.createElement("span");
      badge.className = "tank-badge";
      badge.textContent = t.Status || "Empty";

      header.appendChild(tankId);
      header.appendChild(badge);

      const details = document.createElement("div");
      details.className = "tank-details";
      details.innerHTML =
        "<div><strong>Beer:</strong> " + (t.Beer || "—") + "</div>" +
        "<div><strong>Batch:</strong> " + (t.Batch || "—") + "</div>";

      card.appendChild(header);
      card.appendChild(details);

      if (t.Type === "Fermenter") {
        fermentation.appendChild(card);
      } else {
        brite.appendChild(card);
      }
    });
  })
  .catch(err => console.error(err));
