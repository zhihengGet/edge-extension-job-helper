import * as React from "react";
import { Input, Paper, Button, Dialog, DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { useAppDispatch } from "./redux/hook";
import { deleteJobApi, updateJobApi } from "./redux/jobSlice";
import { job } from "./types";
import GoButton from "./component/GoButton";
import { viewableKey } from "./constants";
import TextFieldUnControlled from "./component/uncontrolled";
import DelButton from "./component/deleteButton";

export const Card = function ({ job }: { job: job }) {
  const [open, setOpen] = React.useState(false);
  function onClose() {
    setOpen(false);
  }
  function handleOpen() {
    setOpen(true);
  }
  const dispatch = useAppDispatch();
  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    //console.log(e.target.id);
    dispatch(updateJobApi({ ...job, [e.target.id]: e.target.value }));
  }

  //console.log("filtered", filtered, job);
  return (
    <Paper sx={{ margin: "1em" }} elevation={2}>
      <Box component="form" noValidate autoComplete="off">
        {viewableKey
          .filter((v) => v != "comment")
          .map((v, i) => {
            return (
              <Tooltip
                title={job.baseURI ?? ""}
                key={v}
                disableHoverListener={v != "company"}
                disableFocusListener={v != "company"}
              >
                <div key={v + i}>
                  <label style={{ color: "lightblue" }} htmlFor={v}>
                    {v} : &nbsp;
                  </label>
                  <TextFieldUnControlled
                    //id={v}
                    el="input"
                    multiline={v == "comment"}
                    job={job}
                    jobKey={v as keyof job}
                    defaultValue={job[v]}
                    sx={{ color: "aqua" }}
                  />
                </div>
              </Tooltip>
            );
          })}
        <DelButton jobKey={job.key} />
        <Button sx={{ color: "gray" }} onClick={handleOpen}>
          Comment
        </Button>
        {job.baseURI ? <GoButton job={job} /> : ""}
      </Box>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add any other info...</DialogTitle>
        <Box m="1em">
          <textarea
            value={job.comment}
            onChange={onChange}
            id="comment"
            rows={4}
            cols={40}
          />
        </Box>
        <Button onClick={onClose}>Add</Button>
      </Dialog>
    </Paper>
  );
};
