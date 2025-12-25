const API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

fetch(API + "?action=tanks")
  .then(response => response.json())
  .then(tanks => {
    if (!Array.isArray(tanks)) {
      console.error("Invalid tank data");
      return;
    }

    var fermentation = document.getElementById("fermentation");
    var brite = document.getElementById("brite");

    fermentation.innerHTML = "";
    brite.innerHTML = "";

    tanks.forEach(t => {
      var status = (t.Status || "Empty").toLowerCase();

      var card = document.createElement("div");
      card.className = "tank status-" + status;

      var header = document.createElement("div");
      header.className = "tank-header";

      var tankId = document.createElement("span");
      tankId.className = "tank-id";
      tankId.textContent = t.TankID || "—";

      var badge = document.createElement("span");
      badge.className = "tank-badge";
      badge.textContent = t.Status || "Empty";

      header.appendChild(tankId);
      header.appendChild(badge);

      var details = document.createElement("div");
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
