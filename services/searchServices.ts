import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const searchSymbol = (symbol: string) => {
  return axiosInstance.get(`stocks/search?query=${symbol}`);
};
