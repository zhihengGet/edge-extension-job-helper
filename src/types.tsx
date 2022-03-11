// built in types
type statusType =
  | "applied"
  | "ghosted"
  | "visited"
  | "offered"
  | "accepted"
  | "everything";
export type filterStatusType = statusType | "everything";
export type sortByType = "applied_at" | "created_at";
export type job = {
  baseURI?: string;
  applied_at?: string;
  created_at: string;
  host?: string;
  status: statusType;
  type: "manual" | "auto";
  // if manually add then we can have company and position
  company?: string; // use document.location.host
  position?: string; // using title of the page
  key: string; // key used for storage, current time
  comment: string;
};

export type jobObjectType = {
  keys: Set<string>;
  data: { [index: string]: job };
};

export type requestAddJob = { type: "getCurrentPageInfo"; data: string[] };
export type responseJAddJob = { type: "getCurrentPageInfo"; data: string[] };
