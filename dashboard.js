var API =
  "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

var xhr = new XMLHttpRequest();
xhr.open("GET", API + "?action=tanks", true);

xhr.onload = function () {
  if (xhr.status !== 200) {
    console.error("Request failed");
    return;
  }

  var tanks;
  try {
    tanks = JSON.parse(xhr.responseText);
  } catch (e) {
    console.error("Invalid JSON");
    return;
  }

  if (!Array.isArray(tanks)) {
    console.error("Tank data invalid");
    return;
  }

  var fermentation = document.getElementById("fermentation");
  var brite = document.getElementById("brite");

  if (!fermentation || !brite) {
    console.error("Dashboard containers missing");
    return;
  }

  tanks.forEach(function (t) {
    var status = (t.Status || "empty").toLowerCase();

    var card = document.createElement("div");
    card.className = "tank status-" + status;

    var h = document.createElement("h4");
    h.textContent = t.TankID;

    var d = document.createElement("div");
    d.textContent = t.Status || "Empty";

    card.appendChild(h);
    card.appendChild(d);

    if (status === "empty") {
      card.onclick = function () {
        window.location.href = "brew-log.html?tank=" + t.TankID;
      };
    }

    if (t.Type === "Fermenter") {
      fermentation.appendChild(card);
    } else {
      brite.appendChild(card);
    }
  });
};

xhr.onerror = function () {
  console.error("Network error");
};

xhr.send();
