import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { useAppDispatch, useAppSelector } from "./redux/hook";
import { updateFilter } from "./redux/jobSlice";
const options = {
  includeScore: true,
  // Search in `author` and in `tags` array
  keys: ["company", "position", "baseURI", "host"],
};

export default function SearchInput() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((s) => s.jobs.jobs);
  function filter(e: any, newValue: string | null) {
    dispatch(updateFilter(newValue));
    console.log("filter ", newValue);
  }
  const keys = React.useMemo(
    () =>
      Array.from(
        new Set(Object.keys(jobs).map((option) => jobs[option].company))
      ),
    [jobs]
  );

  return (
    <Stack spacing={2} sx={{ width: 300, marginBottom: "1em" }}>
      <Autocomplete
        id="search_bar"
        freeSolo
        options={keys.length > 0 ? keys : []}
        onInputChange={filter}
        autoHighlight
        onChange={filter}
        renderInput={(params) => <TextField {...params} label="search..." />}
      />
    </Stack>
  );
}
