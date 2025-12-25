document.addEventListener("DOMContentLoaded", function () {
  var API_URL =
    "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec?action=tanks";

  fetch(API_URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderTanks(data);
    })
    .catch(function (err) {
      console.error("FETCH ERROR:", err);
      alert("Failed to load tank data");
    });
});

function renderTanks(tanks) {
  var ferm = document.getElementById("fermentation");
  var brite = document.getElementById("brite");

  ferm.innerHTML = "";
  brite.innerHTML = "";

  tanks.forEach(function (t) {
    var rawStatus = (t.Status || "Empty").toString();
    var status = rawStatus.trim().toLowerCase();

    var card = document.createElement("div");
    card.className = "tank status-" + status;

    card.innerHTML =
      "<h4>" +
      t.TankID +
      "</h4>" +
      "<div><strong>Status:</strong> " +
      rawStatus +
      "</div>" +
      "<div><strong>Batch:</strong> " +
      (t.Batch || "—") +
      "</div>" +
      "<div><strong>Day:</strong> " +
      (t.Day || "—") +
      "</div>";

    card.addEventListener("click", function () {
      if (status === "empty") {
        window.location.href =
          "brew-log.html?tank=" + encodeURIComponent(t.TankID);
      } else {
        alert(
          "Tank: " +
            t.TankID +
            "\nStatus: " +
            rawStatus +
            "\nBatch: " +
            (t.Batch || "—")
        );
      }
    });

    if (t.Type === "Fermenter") {
      ferm.appendChild(card);
    }

    if (t.Type === "Brite") {
      brite.appendChild(card);
    }
  });
}
