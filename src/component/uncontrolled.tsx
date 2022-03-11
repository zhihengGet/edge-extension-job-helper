import { CircularProgress, Input, TextField } from "@mui/material";
import React from "react";
import debounce from "lodash/debounce";
import { useAppDispatch } from "../redux/hook";
import { updateJobApi } from "../redux/jobSlice";
import InputAdornment from "@mui/material/InputAdornment";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { job } from "../types";
// uncontrolled, and debounced global state update
function TextFieldUnControlled(props: {
  label?: string;
  error?: boolean;
  job: job;
  defaultValue: string;
  type?: "text" | "date";
  el: "textfield" | "input";
  multiline?: boolean;
  maxRows?: number;
  jobKey: keyof job;
  sx?: any;
}) {
  const [isLoading, loading] = React.useState(false);
  const dispatch = useAppDispatch();
  const fn = React.useCallback(debounce(updateStore, 600), []);
  async function updateStore(value) {
    await dispatch(updateJobApi({ ...props.job, [props.jobKey]: value }));
    loading(false);
  }

  const listen = React.useCallback(function listener(e) {
    // console.log("changing", e.target.value);
    loading(true);
    fn(e.target.value);
  }, []);

  function handleInput(e: HTMLElement) {
    if (!e) return;
    //console.log("register event listener");
    e.addEventListener("keyup", listen);
  }

  React.useEffect(() => {
    return document.removeEventListener("keyup", listen);
  }, []);

  const refCallback = React.useCallback(handleInput, []);

  const textfieldProps = {
    multiline: props.multiline,
    defaultValue: props.defaultValue,
    maxRows: props.maxRows,
    label: props.label,
    error: props.error,
    sx: props.sx,
  };

  if (props.jobKey == "comment") {
    return (
      <TextareaAutosize
        defaultValue={props.defaultValue}
        maxRows={props.maxRows}
        ref={refCallback}
        style={{
          minWidth: "100px",
          color: "aqua",
          backgroundColor: "#121212",
        }}
      />
    );
  }

  return (
    <>
      {props.el == "input" ? (
        <Input
          inputRef={refCallback}
          size="small"
          {...textfieldProps}
          endAdornment={
            <InputAdornment position="end">
              {isLoading ? <CircularProgress size="small" /> : ""}
            </InputAdornment>
          }
        />
      ) : (
        <TextField
          inputRef={refCallback}
          {...textfieldProps}
          size="small"
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                {isLoading ? <CircularProgress /> : ""}
              </InputAdornment>
            ),
          }}
        />
      )}
    </>
  );
}

export default TextFieldUnControlled;
