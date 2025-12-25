/*********************************************************
 * AUTO-SELECT TANK BASED ON CLICK SOURCE (LOCKED + SAFE)
 *********************************************************/
document.addEventListener("click", (e) => {
  const tankValue = e.target?.dataset?.tank;
  if (!tankValue) return;

  const tankSelect = document.getElementById("tank");
  if (!tankSelect) return;

  // Ensure this works ONLY for <select>
  if (tankSelect.tagName !== "SELECT") {
    console.warn("Tank auto-select failed: #tank is not a <select>");
    return;
  }

  // Set value
  tankSelect.value = tankValue;

  // Force downstream listeners to fire
  tankSelect.dispatchEvent(new Event("change", { bubbles: true }));
});


/*********************************************************
 * GRAIN BILL – POPULATE GRAINS
 *********************************************************/
const grains = ["Pilsner", "Munich"];
const grainTable = document.getElementById("grainTable");

if (grainTable) {
  grainTable.innerHTML = "";

  grains.forEach(grain => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${grain}</td>
      <td>—</td>
      <td><input type="number"></td>
    `;
    grainTable.appendChild(tr);
  });
}


/*********************************************************
 * MASH SCHEDULE
 *********************************************************
 * STATIC BY DESIGN
 * HTML controls layout, spacing, pH, start/end times
 * JS MUST NOT TOUCH THIS
 *********************************************************/


/*********************************************************
 * WATER PROFILE
 *********************************************************
 * Grid + inputs controlled in HTML/CSS
 * JS intentionally does nothing
 *********************************************************/


/*********************************************************
 * LAUTER TUN
 *********************************************************
 * Static layout for column alignment
 * JS intentionally does nothing
 *********************************************************/


/*********************************************************
 * BOIL
 *********************************************************
 * Start / End handled in HTML
 *********************************************************/


/*********************************************************
 * KNOCKOUT
 *********************************************************
 * Volume / Gravity / pH handled in HTML
 *********************************************************/


/*********************************************************
 * YEAST (NEXT CARD)
 *********************************************************
 * Placeholder — do not implement yet
 *********************************************************/


/*********************************************************
 * SAVE LOG (FUTURE)
 *********************************************************
 * Data collection later
 *********************************************************/
