window.onload = async function () {
  let response = await fetch(chrome.extension.getURL("sku-data.json"));
  let responseJson = await response.json();
  console.log(responseJson);

  chrome.storage.local.get("skuData", function (data) {
    console.log(data.skuData);
    // document.querySelector("#summary").innerHTML = JSON.stringify(data.skuData);

    const combinedArray = data.skuData.reduce((acc, current) => {
      const existing = acc.find((item) => item.SKU === current.SKU);
      if (existing) {
        existing.quantity += current.quantity;
      } else {
        current.description = responseJson[current.SKU];
        acc.push({ ...current });
      }

      return acc;
    }, []);

    const generateTable = (data) => {
      let table =
        '<table border="1"><tr><th>SKU</th><th>Description</th><th>Quantity</th></tr>';
      data.forEach((item) => {
        table += `<tr><td>${item.SKU}</td><td>${item.description}</td><td align=center>${item.quantity}</td></tr>`;
      });
      table += "</table>";
      return table;
    };

    document.querySelector("#summary").innerHTML = generateTable(combinedArray);
  });
};
