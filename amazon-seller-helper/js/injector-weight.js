// var tables = document.querySelectorAll("table>tr table.a-bordered");
var tables = document.querySelectorAll("table.inner-order-table");
var netWeight;
var weightColumnInput;
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

tables.forEach((table) => {
  netWeight = 0;
  weightColumnInput = null;

  var tableRows = [...table.querySelectorAll("tr.order-item-row")];

  tableRows.forEach((tableRow) => {
    l(tableRow);
    // Getting SKU and Quantity
    var firstColumn = tableRow.querySelector(
      ".vertical-center.char-spaced-elements"
    );
    if (firstColumn) {
      var column = firstColumn.querySelector("div:last-child .align-start");
      var sku = column.querySelector(
        "div:first-child span[data-testid='line-item-sku']"
      ).innerText;
      var quantity = Number(
        column.querySelector(
          "div:last-child span[data-testid='line-item-quantity']"
        ).innerText
      );

      if (allSKUData[sku]) {
        netWeight += allSKUData[sku].weight * quantity;
      } else {
        netWeight += 1000 * quantity;
      }
    }
    // l(netWeight);

    // Filling weight
    if (!weightColumnInput) {
      weightColumnInput = queryDeepShadow(
        "kat-input >>> .container >>> input",
        table.querySelector("td.order-item-cell:nth-child(2)")
      );
    }
  });

  if (weightColumnInput) {
    fillField(weightColumnInput, netWeight);
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
