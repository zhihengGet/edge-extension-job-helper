import { job } from "./../types";
import { toYearMonthDay } from "./dateFormat";
export function getSiteData(): job {
  return {
    // host: document.location.host,
    baseURI: document.baseURI,
    position: document.title,
    company: document.location.hostname,
    key: document.baseURI,
    status: "visited",
    type: "auto",
    created_at: toYearMonthDay(undefined),
    comment: "",
  };
}
