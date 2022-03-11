import React from "react";

import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContentText,
  Divider,
  Stack,
  Paper,
  Tooltip,
} from "@mui/material";
import "./App.css";
import CreateButton from "./createJob";
import Cards from "./jobList";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { initializeJob, clearJobApi } from "./redux/jobSlice";
import FreeSolo from "./searchInput";
import LinearProgress from "@mui/material/LinearProgress";
import TextFieldUnControlled from "./component/uncontrolled";
import { toYearMonthDay } from "./lib/dateFormat";
import down from "./lib/download";

//import down from "./lib/download";

function Stats() {
  const jobs = useAppSelector((s) => s.jobs.jobs);

  let statusCount = {};
  let size = 0;
  const temp = Object.entries(jobs);
  temp.forEach((v) => {
    let status = v[1].status;
    size++;

    if (!statusCount[status]) statusCount[status] = 1;
    else statusCount[status]++;
  });

  return (
    <Box
      display={"flex"}
      height="fit-content"
      flexWrap={"wrap"}
      justifyContent={"center"}
    >
      {Object.keys(statusCount).map((v) => {
        return (
          <Paper key={v} elevation={20} sx={{ padding: "1em", m: "3px" }}>
            <Typography variant="subtitle2">{v}</Typography>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                lineHeight: "10px",
                color: "CornflowerBlue",
              }}
            >
              {statusCount[v]}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
// disable console.log
if (chrome.storage) console.log = () => {};

function App() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  // get job list
  React.useEffect(() => {
    setLoading(true);
    dispatch(initializeJob());
    setLoading(false);
  }, []);

  return (
    <Box
      borderTop="1px red solid"
      maxWidth="100%"
      minWidth={"500px"}
      className="Container"
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          marginTop: "10px",
          padding: "5px",
        }}
      >
        <Typography variant="h4" color="lightgray">
          Career Tracker
        </Typography>
        <Stats />
        <Divider />
        {loading ? <LinearProgress /> : ""}
        <CreateButton />
        <div>
          <Button
            sx={{
              backgroundColor: "purple",
              textTransform: "lowercase",
              marginBottom: "1em",
            }}
            onClick={() => setOpen(true)}
          >
            Clear All
          </Button>{" "}
        </div>
        <FreeSolo />
        <Cards />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ sx: { width: "200px", padding: "20px" } }}
        >
          <DialogContentText>
            Are you sure ? This action is not reversible !
          </DialogContentText>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => dispatch(clearJobApi())}>Submit</Button>
        </Dialog>
        <footer>
          <Typography color="purple">Made with love and fire!</Typography>{" "}
        </footer>
      </Box>
    </Box>
  );
}

export default App;
