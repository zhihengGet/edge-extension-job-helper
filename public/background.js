// background.js

chrome.runtime.onInstalled.addListener(async () => {
  console.log("installed");
});
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["extractSite.js"],
  });
});
chrome.tabs.onActivated.addListener(async (tab) => {
  console.log("tab changed");
  chrome.scripting.executeScript({
    target: { tabId: tab.tabId },
    files: ["extractSite.js"],
  });

  const added = await chrome.storage.sync.get(
    (
      await chrome.tabs.get(tab.tabId)
    ).url
  );
  //console.log("tab change update badge title", added);
  chrome.action.setBadgeText({
    text: Object.keys(added).length >= 1 ? "+" : "-",
  });
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);

  /*  if (command == "add_job") {
    let url = (await chrome.tabs.get(tab.tabId)).url;
    chrome.storage.sync.set({ [url]: { baseURI: url } });
  } */
  //chrome.runtime.reload();
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`
      //`Old value was "${oldValue}", new value is "${newValue}".`
    );
    // delete entry
    if (!newValue) {
      chrome.action.setBadgeText({ text: "-" });
      chrome.action.setBadgeBackgroundColor({ color: "lightblue" });
    } else if (newValue) {
      //update or add
      chrome.action.setBadgeText({ text: "+" });
      chrome.action.setBadgeBackgroundColor({ color: "DarkSlateBlue" });
    }

    console.table(newValue, oldValue);
  }
});
