// l(chrome.storage);
var tableRows = document.querySelectorAll(
  ".a-box-group .a-box:not(.a-box-title) .a-list-item .a-row>div"
);
var skuData = [];
// l("tableRows", tableRows);
tableRows.forEach(tableRow => {
  // Getting SKU and Quantity
  const childDivs = tableRow.querySelectorAll("div.a-column");
  const quantityDiv = childDivs[0];
  const skuDiv = childDivs[2];
  const SKU = skuDiv.querySelector("div div span div>span:last-child")
    .innerText;
  const quantity = Number(
    quantityDiv.querySelector("div div span div>span:last-child").innerText
  );

  skuData.push({
    SKU,
    quantity
  });
});

// l(skuData);

chrome.storage.local.set({ skuData });
