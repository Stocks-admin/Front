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
      const orderedStocks = action.payload.sort((a, b) => {
        let aPrice = 1,
          bPrice = 1;

        if (a.type === "Currency" && b.type !== "Currency") {
          return -1;
        }

        if (a.bond_info?.batch !== undefined) {
          aPrice = a.current_price * a.bond_info.batch;
        } else if (!a.hasError) {
          aPrice = a.current_price;
        }

        if (b.bond_info?.batch !== undefined) {
          bPrice = b.current_price * b.bond_info.batch;
        } else if (!b.hasError) {
          bPrice = b.current_price;
        }

        return bPrice * b.final_amount - aPrice * a.final_amount;
      });
      return { stocks: orderedStocks, status: "success" };
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
