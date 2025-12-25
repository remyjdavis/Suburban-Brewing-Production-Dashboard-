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

  var ferm = document.getElementById("fermentation");
  var brite = document.getElementById("brite");

  tanks.forEach(function (t) {
    var status = (t.Status || "empty").toLowerCase();

    var card = document.createElement("div");
    card.className = "tank " + status;

    var title = document.createElement("h4");
    title.textContent = t.TankID;

    var state = document.createElement("div");
    state.textContent = t.Status || "Empty";

    card.appendChild(title);
    card.appendChild(state);

    if (status === "empty") {
      card.onclick = function () {
        window.location.href = "brew-log.html?tank=" + t.TankID;
      };
    }

    if (t.Type === "Fermenter") {
      ferm.appendChild(card);
    } else {
      brite.appendChild(card);
    }
  });
};

xhr.onerror = function () {
  console.error("Network error");
};

xhr.send();
