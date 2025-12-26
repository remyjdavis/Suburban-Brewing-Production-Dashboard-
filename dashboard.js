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
      const status = (t.Status || "EMPTY").toLowerCase();

      const card = document.createElement("div");
      card.className = "tank status-" + status;

      /* CLICK → OPEN BREW LOG */
     card.addEventListener("click", () => {
  const params = new URLSearchParams({
    brewId: t.Batch || "",
    tank: t.TankID || ""
  });

  if ((t.Status || "").toUpperCase() === "FERMENTING") {
    window.location.href = "fermentation.html?" + params.toString();
  } else {
    window.location.href = "brew-log.html?" + params.toString();
  }
});


      const header = document.createElement("div");
      header.className = "tank-header";

      const tankId = document.createElement("span");
      tankId.className = "tank-id";
      tankId.textContent = t.TankID || "—";

      const badge = document.createElement("span");
      badge.className = "tank-badge";
      badge.textContent = t.Status || "EMPTY";

      header.appendChild(tankId);
      header.appendChild(badge);

      const details = document.createElement("div");
      details.className = "tank-details";
      details.innerHTML =
        "<div><strong>Active Brew:</strong> " +
        (t.ActiveBrewID || "—") +
        "</div>" +
        "<div><strong>Last Brew:</strong> " +
        (t.LastBrewDate || "—") +
        "</div>";

      card.appendChild(header);
      card.appendChild(details);

      /* ALL FV GO TO FERMENTATION COLUMN */
      fermentation.appendChild(card);
    });
  })
  .catch(err => console.error(err));
