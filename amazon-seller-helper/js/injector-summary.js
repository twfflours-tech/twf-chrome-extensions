// l(chrome.storage);
var tableRows = document.querySelectorAll("table>tr table>tr.order-row-item");
var skuData = [];
tableRows.forEach((tableRow) => {
  // Getting SKU and Quantity
  var firstColumn = tableRow.querySelector("td.a-span5");

  if (firstColumn) {
    var column = firstColumn.querySelector(".a-col-right > div:last-child");
    skuData.push({
      SKU: column.childNodes[3].data,
      quantity: Number(
        column.childNodes[6].innerText.replace("Quantity :", "")
      ),
    });
  }
});

chrome.storage.local.set({ skuData });
