import { UserPortfolio } from "@/models/reduxModel";
import { UserStock } from "@/models/userModel";
import { getUserPortfolio } from "@/services/userServices";
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
    updatePortfolio: (state) => {
      getUserPortfolio()
        .then((res) => {
          if (res.status === 200) {
            return { stocks: res.data, status: "success" };
          } else {
            return { stocks: [], status: "failed" };
          }
        })
        .catch((err) => {
          return { stocks: [], status: "failed" };
        });
    },
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
  updatePortfolio,
  setPortfolio,
  addToPortfolio,
  setPortfolioStatus,
  cleanPortfolio,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
