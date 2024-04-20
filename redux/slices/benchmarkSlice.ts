import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IBenchmark {
  status: "idle" | "loading" | "failed" | "success" | "impersonated";
  benchmark: {
    dollar: number;
    uva: number;
  };
}

const initialState: IBenchmark = {
  status: "idle",
  benchmark: {
    dollar: 0,
    uva: 0,
  },
};

export const benchmarkSlice = createSlice({
  name: "benchmark",
  initialState,
  reducers: {
    setBenchmark: (state, action: PayloadAction<IBenchmark["benchmark"]>) => {
      return { ...state, benchmark: action.payload };
    },
    setBenchmarkStatus: (
      state,
      action: PayloadAction<IBenchmark["status"]>
    ) => {
      return { ...state, status: action.payload };
    },
  },
});

export const { setBenchmark, setBenchmarkStatus } = benchmarkSlice.actions;

export default benchmarkSlice.reducer;
