let response;
let responseJson;
document
  .querySelector("#fill-button")
  .addEventListener("click", async function () {
    response = await fetch(chrome.extension.getURL("data.json"));
    responseJson = await response.json();

    chrome.tabs.executeScript(
      {
        // Send the value to be used by our script
        code: `var l = console.log.bind(window.console); var dimensions = ${JSON.stringify(
          responseJson
        )};`,
      },
      function () {
        // Run the script in the file injector.js
        chrome.tabs.executeScript({
          file: "injector.js",
        });
      }
    );
  });

document
  .querySelector("#show-summary")
  .addEventListener("click", async function () {
    chrome.tabs.executeScript(
      {
        // Send the value to be used by our script
        code: `var l = console.log.bind(window.console);`,
      },
      async function () {
        // Run the script in the file injector-summary.js
        await chrome.tabs.executeScript({
          file: "injector-summary.js",
        });

        await chrome.tabs.create({ url: "summary.html" });
      }
    );
  });
