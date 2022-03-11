import React, { PureComponent } from "react";
import { Button } from "@mui/material";
import { useAppDispatch } from "../redux/hook";
import { deleteJobApi, updateJobApi } from "../redux/jobSlice";
import { job } from "../types";
export default function DelButton({ jobKey }: { jobKey: job["key"] }) {
  const dispatch = useAppDispatch();
  return (
    <Button
      sx={{ color: "gray" }}
      onClick={() => dispatch(deleteJobApi(jobKey))}
    >
      Delete
    </Button>
  );
}
