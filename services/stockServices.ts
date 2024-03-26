import axiosInstance from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

interface SymbolPrice {
  value: number;
  date: string;
  type: string;
  conversionRate: {
    value: number;
    date: string;
  };
}

export const getSymbolPrice = (
  symbol: string,
  market: string,
  date: string
): Promise<AxiosResponse<SymbolPrice>> => {
  return axiosInstance.get(`stocks/symbolValue/${symbol}`, {
    params: {
      market,
      date,
    },
  });
};
