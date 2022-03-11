import { addJobHelper } from "../chromeAPI";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { job } from "../types";
import { getSiteData } from "../lib/getSiteData";
import { toYearMonthDay } from "../lib/dateFormat";

// Define a type for the slice state
interface Job {
  jobs: { [n: string]: job };
  filter: Partial<job>;
}
// generate test data
function test() {
  let t = {};

  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  for (let x in new Array(20).fill(0)) {
    t[x] = {
      host: x,
      baseURI: "https://www.pinterestcareers.com/profile/thank-you/",
      created_at: toYearMonthDay(
        randomDate(new Date(2012, 0, 1), new Date()).getTime()
      ),
      applied_at: toYearMonthDay(null),
      company: "Google(i hope)",
      status: "ghosted",
      key: x,
      comment:
        "somtry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to mae ",
      //type: "manual",
    } as job;
  }
  return t;
}

let jobs: { [n: string]: job } = chrome.storage ? {} : test();

// Define the initial state using that type
export const initialState: Job = {
  jobs: jobs,
  filter: {},
};
// First, create the thunk

export const initializeJob = createAsyncThunk(
  "job/initialize",
  //@ts-ignore
  async (arg, thunkAPI) => {
    const response = await chrome.storage.sync.get(null);
    thunkAPI.dispatch(initJobs(response));
  }
);
export const addJobApi = createAsyncThunk(
  "job/add",
  async (newJob: job | null, thunkAPI) => {
    if (chrome.storage) {
      await addJobHelper(newJob, (data: job) =>
        thunkAPI.dispatch(addJob(data))
      );
    } else {
      // testing purpose
      if (!newJob) newJob = getSiteData();
      console.log("in slice adding new job", newJob);
      if (newJob) thunkAPI.dispatch(addJob(newJob));
    }
  }
);
export const deleteJobApi = createAsyncThunk(
  "job/delete",
  async (key: string, thunkAPI) => {
    console.log("deleting", key);
    if (chrome.storage) await chrome.storage.sync.remove(key);
    thunkAPI.dispatch(removeJob(key));
    return true;
  }
);
export const clearJobApi = createAsyncThunk(
  "job/clear",
  async (id, thunkAPI) => {
    if (chrome.storage) await chrome.storage.sync.clear();
    thunkAPI.dispatch(clearJob());
  }
);
export const updateJobApi = createAsyncThunk(
  "job/update",
  async (job: job, thunkAPI) => {
    const response = chrome.storage
      ? await chrome.storage.sync.set({ [job.key]: job })
      : "";
    thunkAPI.dispatch(updateJob(job));
    return response;
  }
);
export const counterSlice = createSlice({
  name: "job",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initJobs: (state, action) => {
      state.jobs = action.payload;
    },

    addJob: (state, action: PayloadAction<job>) => {
      console.log("add job ???", action);
      state.jobs[action.payload.key] = action.payload;
    },
    removeJob: (state, action: PayloadAction<string>) => {
      delete state.jobs[action.payload];
    },
    updateJob: (state, action) => {
      state.jobs[action.payload.key] = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    clearJob: (state) => {
      state.jobs = {}; // initialState;
    },
    updateFilter: (state, action: PayloadAction<Partial<string>>) => {
      state.filter["company"] = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(initializeJob.fulfilled, (state, action) => {
      // Add user to the state array
      //state.jobs = action.payload;
    });
    builder.addCase(initializeJob.rejected, (state, action) => {
      // Add user to the state array
      console.error("failed to get job list", action);
    });
    builder.addCase(addJobApi.rejected, (state, action) => {
      console.error("failed to add job ", action);
    });
    builder.addCase(clearJobApi.rejected, (state, action) => {
      console.error("failed to clearJobApi job ", action);
    });
    builder.addCase(updateJobApi.rejected, (state, action) => {
      console.error("failed to updateJobApi job ", action);
    });
    builder.addCase(addJobApi.fulfilled, (state, action) => {
      //console.error("added job ", action);
    });
  },
});

export const {
  initJobs,
  updateFilter,
  addJob,
  removeJob,
  updateJob,
  clearJob,
} = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.jobs.jobs;

export default counterSlice.reducer;
