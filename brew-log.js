const API = "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec";

document.getElementById("brewForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  fetch(API, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(() => {
      e.target.reset();
      loadBrews();
    });
});

function loadBrews() {
  fetch(API + "?action=brews")
    .then(r => r.json())
    .then(brews => {
      document.getElementById("history").innerHTML =
        brews.map(b =>
          `<div>${b.BrewDate} – <strong>${b.Beer}</strong> (${b.Stage})</div>`
        ).join("");
    });
}

loadBrews();
