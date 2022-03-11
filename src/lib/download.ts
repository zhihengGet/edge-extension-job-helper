import { store } from "./../redux/store";
import { job, jobObjectType } from "./../types";
import { json2csv } from "json-2-csv";
function getDomString() {
  return document.documentElement.outerHTML;
}
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  //delete link;
}
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type JobsType = { [n: string]: job };

export default async function down() {
  // generate csv

  const items = Object.values(store.getState().jobs.jobs);
  const replacer = (key, value) => (value === null ? "Null" : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  //  console.log(csv);

  /*   if (chrome.downloads) {
    let blob = new Blob([csv], {
      type: "text/plain",
    });
    let url = URL.createObjectURL(blob);
    chrome.downloads.download(
      {
        url: url, // The object URL can be used as download URL
        filename: "career_tracker.html",
        // saveAs: true,
      },
      (e) => console.warn("error in download", e)
    );

    window.URL.revokeObjectURL(url);
  } */

  downloadURI("data:text/plain;charset=utf-8," + csv, "career.txt");
}

export function view() {
  chrome.tabs.create({
    url: "index.html",
  });
}
