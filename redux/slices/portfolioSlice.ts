import { UserPortfolio } from "@/models/reduxModel";
import { UserStock } from "@/models/userModel";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  status: "idle" | "loading" | "failed" | "success";
  stocks: UserPortfolio;
}

const initialState: PortfolioState = {
  status: "idle",
  stocks: [],
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<UserStock[]>) => {
      return { stocks: action.payload, status: "success" };
    },
    addToPortfolio: (state, action: PayloadAction<UserStock>) => {
      state.stocks.push(action.payload);
    },
    setPortfolioStatus: (
      state,
      action: PayloadAction<PortfolioState["status"]>
    ) => {
      return { ...state, status: action.payload };
    },
    cleanPortfolio: () => {
      return initialState;
    },
  },
});

export const {
  setPortfolio,
  addToPortfolio,
  setPortfolioStatus,
  cleanPortfolio,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
