l(dimensions);
// l(chrome.storage);

function queryDeepShadow(selector, root) {
  let element = root || document;
  const selectors = selector.split(">>>");

  for (const s of selectors) {
    element = element.querySelector(s.trim());
    if (element && element.shadowRoot) {
      element = element.shadowRoot;
    } else if (!element) {
      return null;
    }
  }
  return element;
}

var orderTables = document.querySelectorAll("table.inner-order-table");

orderTables.forEach((orderTable) => {
  // l(orderTable);
  // Filling dimensions
  var weightColumn = orderTable.querySelector(
    "td.order-item-cell:nth-child(2)"
  );

  var dimensionsColumn = orderTable.querySelector(
    "td.order-item-cell:nth-child(3)"
  );

  var weightColumnInput = queryDeepShadow(
    "kat-input >>> .container >>> input",
    weightColumn
  );

  if (weightColumnInput) {
    // l("Element found:", weightColumnInput);
    var weight = Number(weightColumnInput.value);

    // Find the matching dimension based on weight range
    const matchingDimension = dimensions.find(
      (dim) => weight >= dim.weightRange[0] && weight <= dim.weightRange[1]
    );

    if (matchingDimension) {
      var lengthInput = queryDeepShadow(
        "kat-input[data-testid='length-input'] >>> .container >>> input",
        dimensionsColumn
      );
      var widthInput = queryDeepShadow(
        "kat-input[data-testid='width-input'] >>> .container >>> input",
        dimensionsColumn
      );
      var heightInput = queryDeepShadow(
        "kat-input[data-testid='height-input'] >>> .container >>> input",
        dimensionsColumn
      );

      fillField(lengthInput, matchingDimension.length);
      fillField(widthInput, matchingDimension.width);
      fillField(heightInput, matchingDimension.height);
    }
  } else {
    // l("Element not found");
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
