import { store } from "@/redux/store";
import { logout as fetchLogout } from "@/services/authServices";
import {
  cleanPortfolio,
  setPortfolioStatus,
} from "@/redux/slices/portfolioSlice";
import { signOut } from "next-auth/react";
import { cleanDollarValue } from "@/redux/slices/dollarSlice";

export default function useLogout() {
  const { dispatch } = store;
  return async (redirect: Boolean = true) => {
    try {
      dispatch(setPortfolioStatus("idle"));
      const resp = await fetchLogout();
      if (resp.status !== 200) {
        dispatch(cleanPortfolio());
        dispatch(cleanDollarValue());
        await signOut({ callbackUrl: "/login" });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        dispatch(cleanPortfolio());
        dispatch(cleanDollarValue());
        await signOut({ callbackUrl: "/login" });
        if (!redirect) return;
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } catch (error) {
      dispatch(cleanPortfolio());
      dispatch(cleanDollarValue());
      if (!redirect) return;
      window.location.href = "/login";
    }
  };
}
