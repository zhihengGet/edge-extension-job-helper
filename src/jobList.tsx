import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Button,
  IconButton,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Pagination from "@mui/material/Pagination";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { Card } from "./Card";
import DelButton from "./component/deleteButton";
import GoButton from "./component/GoButton";
import TextFieldUnControlled from "./component/uncontrolled";
import { viewableKey } from "./constants";
import down from "./lib/download";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { deleteJobApi, updateJobApi } from "./redux/jobSlice";
import { filterStatusType, job, sortByType } from "./types";

export default function JobList() {
  const jobs = useAppSelector((s) => s.jobs.jobs);
  const dispatch = useAppDispatch();
  const [status, setStatus] = React.useState<filterStatusType>("everything");
  const [asc, setASC] = React.useState(false);
  const [page, setPage] = React.useState(1);
  // extra filter used for search input to filter by name
  const filter = useAppSelector((s) => s.jobs.filter);
  const [sortBy, setSortType] = React.useState<"created_at" | "applied_at">(
    "created_at"
  );

  React.useEffect(() => {
    setPage(1);
  }, [status, asc, jobs, filter]);

  // get all status key (custom)
  const statusKeys = Array.from(
    new Set(Object.values(jobs).map((v) => v.status))
  ).concat(["everything"]);

  const filtered = React.useMemo(
    () =>
      Object.entries(jobs).filter(
        (v) =>
          v[1].status == status ||
          (status == "everything" &&
            (v[1].company == filter.company || !filter.company))
      ),

    [status, jobs, filter]
  );
  console.log("ordered", filtered);

  const sorted = React.useMemo(() => {
    console.log("before order ", asc, filtered[0]);
    if (asc) {
      // from old to latest
      filtered.sort((a, b) => {
        //@ts-ignore
        return a[1][sortBy] < b[1][sortBy] ? -1 : 1;
      });
    } else {
      // from latest to old
      filtered.sort((a, b) => {
        //@ts-ignore
        return a[1][sortBy] > b[1][sortBy] ? -1 : 1;
      });
    }
    // immutable
    return [...filtered];
  }, [sortBy, asc, jobs, filtered]);

  console.log("after order", sorted[0]);
  const paginated = React.useMemo(() => {
    const ans: typeof filtered[] = [];
    const s = sorted?.length || 0;
    let i = 0; // iterate with 10 step

    while (i < s) {
      const chunk = [];

      for (let x = i; x < i + 10 && x < s; x++) {
        chunk.push(sorted[x]);
      }
      console.log("chunk", chunk);
      ans.push(chunk);
      i += 10;
    }

    return ans;
  }, [sortBy, status, filtered, sorted]);

  console.log("paginated", paginated);
  // do those locally
  function onStatusChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    setStatus(e.target.value as filterStatusType);
  }
  function onSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSortType(e.target.value as typeof sortBy);
  }

  const handleChange = (_event: any, value: number) => {
    setPage(value);
  };
  const [checked, setChecked] = React.useState(true);

  const handleSwitch = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    setChecked(checked);
  };
  if (statusKeys.length == 1) return <Typography>empty...</Typography>;
  return (
    <Box
      sx={{
        width: "100%",

        display: "flex",
        flexFlow: "column nowrap",
        alignItems: "Center",
      }}
    >
      <div>
        <TextField
          label="status"
          select
          value={status}
          onChange={onStatusChange}
          SelectProps={{
            native: true,
          }}
          sx={{ mr: "1em" }}
        >
          {statusKeys.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </TextField>

        <TextField
          label="sort"
          select
          value={sortBy}
          onChange={onSortChange}
          SelectProps={{
            native: true,
          }}
        >
          {["applied_at", "created_at"]?.map((v: sortByType) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </TextField>
      </div>
      <IconButton onClick={() => setASC(!asc)}>
        {asc ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </IconButton>
      <FormGroup>
        <FormControlLabel
          checked={checked}
          onChange={handleSwitch}
          control={<Switch />}
          label="table mode"
        />
      </FormGroup>
      <Tooltip title="comma separated table, you can open with excel...">
        <Button onClick={down}>Download</Button>
      </Tooltip>
      {checked == false ? (
        <>
          <div className="scrollbar" style={{ minWidth: "400px" }}>
            {paginated[page - 1]?.map((v, i) => {
              if (status == "everything" || v[1].status == status) {
                return (
                  <div key={i}>
                    <Card job={v[1]} />
                  </div>
                );
              }
            })}
          </div>
          <Pagination
            count={Math.ceil(filtered.length / 10)}
            page={page} // page starts at 1
            onChange={handleChange}
          />
        </>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: "1000px" }}>
          <Table
            id="download_table"
            sx={{ overflowX: "auto", minWidth: "600px" }}
            size="small"
          >
            <TableHead>
              <TableRow>
                {viewableKey.concat(["delete", "url"]).map((v) => {
                  return <TableCell key={v}>{v}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((data) => {
                return (
                  <TableRow key={data[0]}>
                    {viewableKey.map((k) => {
                      return (
                        <TableCell key={k}>
                          <TextFieldUnControlled
                            multiline={k == "comment"}
                            maxRows={5}
                            defaultValue={data[1][k]}
                            job={data[1]}
                            jobKey={k as keyof job}
                            el="input"
                            sx={{
                              minWidth: k == "company" ? "200px" : "90px",
                            }}
                          />
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <DelButton jobKey={data[1].key} />
                    </TableCell>
                    <TableCell>
                      <GoButton job={data[1]} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
