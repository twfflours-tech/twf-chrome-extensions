var tables = document.querySelectorAll("table>tr table.a-bordered");
var netWeight;
var weightColumnInput;

tables.forEach((table) => {
  netWeight = 0;
  weightColumnInput = null;

  var tableRows = [...table.querySelectorAll("tr.order-row-item")];
  tableRows.splice(0, 1);

  // l(table, tableRows);
  tableRows.forEach((tableRow) => {
    // Getting SKU and Quantity
    var firstColumn = tableRow.querySelector("td.a-span5");

    if (firstColumn) {
      var column = firstColumn.querySelector(".a-col-right > div:last-child");
      var sku = column.childNodes[3].data;
      var quantity = Number(
        column.childNodes[6].innerText.replace("Quantity :", "")
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
      weightColumnInput = tableRow.querySelector(
        "td.a-span2 input[name='weight']"
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
