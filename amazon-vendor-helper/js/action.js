document
  .querySelector("#show-summary")
  .addEventListener("click", async function() {
    chrome.tabs.executeScript(
      {
        // Send the value to be used by our script
        code: `var l = console.log.bind(window.console);`
      },
      async function() {
        // Run the script in the file injector-summary.js
        await chrome.tabs.executeScript({
          file: "js/injector-summary.js"
        });

        await chrome.tabs.create({ url: "summary.html" });
      }
    );
  });
