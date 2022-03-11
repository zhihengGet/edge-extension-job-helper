// content script  used to get site info

// manually add job : current page
//import { getSiteData } from "./lib/getSiteData";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  let data = {
    host: document.location.host,
    title: document.title,
    baseURI: document.baseURI,
    key: document.baseURI,
    company: document.location.hostname,
    position: document.title,
    created_at: new Date().toISOString().split("T")[0],
    applied_at: new Date().toISOString().split("T")[0],
    type: "auto",
    status: "visited",
  };
  // console.log(document.location.host, document.title, document.baseURI);

  if (request.type === "getCurrentPageInfo")
    sendResponse({ type: "getCurrentPageInfo", data: data });
});
