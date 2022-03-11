import { filterStatusType, sortByType } from "./types";

const statusToSortValue: { [key in filterStatusType]: sortByType[] } = {
  applied: ["applied_at", "created_at"],
  ghosted: ["created_at"],
  visited: ["created_at"],
  everything: ["created_at", "applied_at"],
  offered: ["applied_at", "created_at"],
  accepted: ["applied_at", "created_at"],
};

const statusFilter = [
  "applied",
  "ghosted",
  "visited",
  "everything",
  "offered",
  "accepted",
] as filterStatusType[];
const sortByValue = ["created_at", "applied_at"];

export const viewableKey = [
  "company",
  "status",
  "position",
  "applied_at",
  "created_at",
  "comment",
];

export { sortByValue, statusFilter, statusToSortValue };
