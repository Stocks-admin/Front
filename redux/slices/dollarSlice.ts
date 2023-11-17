import { UserPortfolio } from "@/models/reduxModel";
import { UserStock } from "@/models/userModel";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

interface DollarState {
  state: "idle" | "loading" | "failed" | "success";
  dollarValue: number;
  last_update: string;
}

const initialState: DollarState = {
  state: "idle",
  dollarValue: 0,
  last_update: "",
};

export const dollarSlice = createSlice({
  name: "dollar",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<DollarState["state"]>) => {
      return { ...state, state: action.payload };
    },
    setDollarValue: (state, action: PayloadAction<DollarState>) => {
      return { ...action.payload, state: "success" };
    },
    cleanDollarValue: (state) => {
      return initialState;
    },
  },
});

export const { setState, setDollarValue, cleanDollarValue } =
  dollarSlice.actions;

export default dollarSlice.reducer;
