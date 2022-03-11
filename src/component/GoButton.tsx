import { Button, IconButton } from "@mui/material";
import React from "react";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { job } from "../types";
//  go to job website
export default function GoButton({ job }: { job: job }) {
  const go = () => {
    chrome.tabs.create({
      url: job.baseURI,
    });
  };
  return (
    <IconButton onClick={go}>
      <LinkIcon />
    </IconButton>
  );
}
import LinkIcon from "@mui/icons-material/Link";
