async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

document
  .querySelector("#show-summary")
  .addEventListener("click", async function() {
    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["js/injector-summary.js"]
    });
    await chrome.tabs.create({ url: "summary.html" });
  });
