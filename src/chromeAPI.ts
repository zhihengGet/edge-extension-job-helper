import { job, jobObjectType } from "./types";
import { getSiteData } from "./lib/getSiteData";
// all chrome api used for popup html

export async function addJobHelper(job: job | null, add: Function) {
  // message content script to get site info
  // still need to update what is in view

  // check if already added
  console.log("in add new page help", job, add);

  if (job) {
    // if we are not in popup  but actual browser for testing

    // form entry
    const r = await chrome.storage.sync.set({
      [job.key]: job,
    });
    add ? add(job) : "";
  }
  // extract job from site
  else {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0].id) {
      async function response(
        res: { type: "getCurrentPageInfo"; data: job },
        resolve: Function
      ) {
        console.log("sending message to get site info", res);

        const data: job = res.data;
        // update storage
        await chrome.storage.sync.set({
          [data.key]: data,
        });
        add ? add(data) : "";
        console.log("adding state ");
        resolve();
      }
      // send message to script
      await new Promise((resolve, reject) =>
        chrome.tabs.sendMessage(
          tabs[0].id as number,
          {
            type: "getCurrentPageInfo",
          },
          (...args) => response(...args, resolve)
        )
      );
    } else {
      console.error("no id in tabs");
    }
  }
}

export async function JobChangeListener() {}
