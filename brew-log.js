const params = new URLSearchParams(location.search);
const tank = params.get("tank");

document.getElementById("tank").value = tank;
document.getElementById("date").valueAsDate = new Date();

function saveBrew() {
  const payload = {
    batchId: crypto.randomUUID(),
    tank,
    beer: beer.value,
    brewer: brewer.value,
    date: date.value,
    targets: {
      targetOG: targetOG.value,
      actualOG: actualOG.value,
      targetVol: targetVol.value,
      actualVol: actualVol.value,
      efficiency: efficiency.value,
      yeast: yeast.value,
      pitchRate: pitchRate.value
    },
    grainBill: grainBill.value,
    water: {
      ca: ca.value,
      mg: mg.value,
      na: na.value,
      so4: so4.value,
      cl: cl.value,
      hco3: hco3.value
    },
    mash: {
      pH: mashPh.value,
      notes: mashNotes.value
    },
    hopSchedule: hopSchedule.value,
    lauter: {
      firstRun: firstRun.value,
      finalRun: finalRun.value,
      notes: lauterNotes.value
    },
    boil: {
      pre: preBoil.value,
      post: postBoil.value,
      notes: boilNotes.value
    },
    knockout: {
      temp: koTemp.value,
      pH: koPh.value,
      notes: koNotes.value
    },
    checkedBy: checkedBy.value
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbzB0d5yltjq5Y1kmk9jDmrgUpRw9NnozKctgh0ELGb6cde7I51xqbcXDoUBbPDjygI5/exec",
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  ).then(() => alert("Brew Log Saved"));
}
