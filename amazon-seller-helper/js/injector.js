// l(dimensions);
// l(chrome.storage);
var tableRows = document.querySelectorAll("table>tr table>tr.order-row-item");
tableRows.forEach((tableRow) => {
  // Filling dimensions
  var weightColumnInput = tableRow.querySelector(
    "td.a-span2 input[name='weight']"
  );

  if (weightColumnInput) {
    var weight = Number(weightColumnInput.value);

    // Find the matching dimension based on weight range
    const matchingDimension = dimensions.find(
      (dim) => weight >= dim.weightRange[0] && weight <= dim.weightRange[1]
    );

    if (matchingDimension) {
      var lengthInput = tableRow.querySelector(
        "td.a-span4 input[name='length']"
      );
      var widthInput = tableRow.querySelector("td.a-span4 input[name='width']");
      var heightInput = tableRow.querySelector(
        "td.a-span4 input[name='height']"
      );

      fillField(lengthInput, matchingDimension.length);
      fillField(widthInput, matchingDimension.width);
      fillField(heightInput, matchingDimension.height);
    }
  }
});

function fillField(field, value) {
  if (field) {
    field.value = value;

    // Life saver line! Dispatch input event to trigger Amazon's validation
    let event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    field.dispatchEvent(event);
  }
}
