import { UserPortfolio } from "@/models/reduxModel";
import { UserStock } from "@/models/userModel";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  status: "idle" | "loading" | "failed" | "success" | "impersonated";
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
      const orderedStocks = action.payload.sort((a, b) => {
        if (a.type === "Currency" && b.type !== "Currency") {
          return -1;
        }

        return (
          b.current_price * b.final_amount - a.current_price * a.final_amount
        );
      });
      return { stocks: orderedStocks, status: state.status };
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
