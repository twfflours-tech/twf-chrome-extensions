let response;
let responseJson;
document
  .querySelector(".fillForm")
  .addEventListener("click", async function () {
    response = await fetch(chrome.extension.getURL("data.json"));
    if (response.ok) {
      responseJson = await response.json();
    }
    // console.log(responseJson);

    //grab the text filed value from my tool
    // var intValue = document.getElementById("apivalue").value;
    chrome.tabs.executeScript(
      {
        //send the value to be used by our script
        code: `var l = console.log.bind(window.console); var dimensions = ${JSON.stringify(
          responseJson
        )};`,
      },
      function () {
        //run the script in the file injector.js
        chrome.tabs.executeScript({
          file: "injector.js",
        });
      }
    );
  });
