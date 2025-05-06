// l(chrome.storage);
var tableRows = document.querySelectorAll(
  "table.inner-order-table tr.order-item-row"
);
var skuData = [];
tableRows.forEach((tableRow) => {
  // Getting SKU and Quantity
  var firstColumn = tableRow.querySelector(
    ".vertical-center.char-spaced-elements"
  );

  if (firstColumn) {
    var column = firstColumn.querySelector("div:last-child .align-start");

    var SKU = column.querySelector(
      "div:first-child span[data-testid='line-item-sku']"
    ).innerText;

    var quantity = Number(
      column.querySelector(
        "div:last-child span[data-testid='line-item-quantity']"
      ).innerText
    );

    skuData.push({
      SKU,
      quantity,
    });
  }
});

chrome.storage.local.set({ skuData });
