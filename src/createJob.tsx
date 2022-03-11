import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  ButtonUnstyled,
  Typography,
  Tooltip,
} from "@mui/material";
import { useAppDispatch } from "./redux/hook";
import { addJob, addJobApi } from "./redux/jobSlice";
import React from "react";
import { job } from "./types";
import { viewableKey } from "./constants";
import { toYearMonthDay } from "./lib/dateFormat";

export default function CreateButton() {
  // callback for add to newJob
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  //@ts-ignore
  const [value, setValue] = React.useState<job>({
    company: "google",
    position: "SWE",
    applied_at: toYearMonthDay(null),
    created_at: toYearMonthDay(null),
    baseURI: "www.google.com/swe/12314123",
    //host: "www.google.com",
    status: "ghosted",
    //type: "manual",
    key: Date.now().toString(),
  });

  return (
    <div
      id="create_job"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        alignItems: "center",
      }}
    >
      <div>
        <Tooltip title="it uses page title as position and page url as company...try refresh page if didn't work out">
          <Button
            variant="outlined"
            onClick={() => dispatch(addJobApi(null))}
            sx={{ margin: "1em" }}
          >
            Add Page
          </Button>
        </Tooltip>
        <Button
          sx={{ margin: "1em" }}
          onClick={() => setOpen(true)}
          variant="outlined"
        >
          Create New
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Insert new Application</DialogTitle>
        <Box
          component="form"
          autoComplete="on"
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            border: "1px lightblue solid",
            margin: "1em",
            bgcolor: "#1a2e14",
          }}
        >
          {viewableKey.concat(["baseURI"]).map((v: string) => {
            return (
              <TextField
                label={v == "baseURI" ? "url" : v}
                key={v}
                multiline={v == "comment"}
                type={v.indexOf("_at") == -1 ? "text" : "date"}
                sx={{ width: "200px", margin: "10px" }}
                //@ts-ignore
                error={value[v] == false}
                value={value[v]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue({
                    ...value,
                    [v]: e.target.value,
                    type: "manual",
                    key: value.company + ":" + value.position,
                  })
                }
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            );
          })}
        </Box>
        <Button
          variant="contained"
          onClick={async () => {
            console.log("inserting new job ", value);
            const t = { ...value, key: new Date().toTimeString() };
            const r = await dispatch(addJobApi(t));
            setOpen(false);
          }}
        >
          Insert
        </Button>
      </Dialog>
    </div>
  );
}
