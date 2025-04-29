window.onload = async function () {
  // let response = await fetch(chrome.extension.getURL("data/sku-data.json"));
  let response = await fetch(
    `https://twfflours.com/cdn/shop/t/31/assets/sku-data-new.json?v=${Date.now()}`
  );
  let allSKUData = await response.json();

  const generateTable = (data) => {
    let table =
      '<table border="1"><tr><th>SKU</th><th>Description</th><th>Quantity</th></tr>';
    data.forEach((item) => {
      table += `<tr><td><b>${item.SKU}</b></td><td>${item.description}</td><td align=center>${item.quantity}</td></tr>`;
    });
    table += "</table>";
    return table;
  };

  chrome.storage.local.get("skuData", function (data) {
    console.log(data.skuData);
    // document.querySelector("#summary").innerHTML = JSON.stringify(data.skuData);

    const combinedArray = data.skuData.reduce((acc, current) => {
      const existing = acc.find((item) => item.SKU === current.SKU);
      if (existing) {
        existing.quantity += current.quantity;
      } else {
        const sku = allSKUData[current.SKU];
        current.description = sku
          ? sku.description
          : "<b>Not added yet - Won't be grouped</b>";
        acc.push({ ...current });
      }

      return acc;
    }, []);

    const eliminated = [];

    const filteredArray = combinedArray
      .reduce((acc, current) => {
        const existing = acc.find((item) => item.SKU === current.SKU);
        if (existing) {
          existing.quantity += current.quantity;
        } else {
          const sku = allSKUData[current.SKU];
          if (!sku) return acc; // Skip if SKU not found

          const { children } = sku;
          if (children) {
            eliminated.push(current.SKU);

            for (const child in children) {
              const quantity = children[child] * current.quantity;
              const existingChild = acc.find((item) => item.SKU === child);
              if (existingChild) {
                existingChild.quantity += quantity;
              } else {
                acc.push({
                  SKU: child,
                  quantity,
                  description: allSKUData[child].description,
                });
              }
            }
          }

          current.description = allSKUData[current.SKU].description;
          acc.push({ ...current });
        }

        return acc;
      }, [])
      .filter((item) => !eliminated.includes(item.SKU));

    document.querySelector("#summary").innerHTML = `
      <div>
        <h2>Original</h2>
        ${generateTable(combinedArray)}
      </div>
      <div>
        <h2>Grouped</h2>
        ${generateTable(filteredArray)}
      </div>
    `;
  });
};
