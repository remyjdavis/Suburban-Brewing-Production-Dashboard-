const BREW_API =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

document.getElementById("brewForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));

  fetch(BREW_API, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      alert("Brew Saved");
      e.target.reset();
      loadBrews();
    });
});

function loadBrews() {
  fetch(BREW_API + "?action=brews")
    .then(res => res.json())
    .then(brews => {
      document.getElementById("brewHistory").innerHTML =
        brews.map(b =>
          `<div><strong>${b.Beer}</strong> – ${b.BrewDate} – ${b.Stage}</div>`
        ).join("");
    });
}

loadBrews();
