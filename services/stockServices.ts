import axiosInstance from "@/utils/axiosInstance";

export const getSymbolPrice = (
  symbol: string,
  market: string,
  date: string
) => {
  return axiosInstance.get(`stocks/symbolValue/${symbol}`, {
    params: {
      market,
      date,
    },
  });
};
