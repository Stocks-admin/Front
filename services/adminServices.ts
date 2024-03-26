import axios from "axios";

export const getAllStocks = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_ARG_DATA}stocks/allStocks`);
};

type UploadImageBody = FormData;

export const uploadImage = async (body: UploadImageBody) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_ARG_DATA}stocks/organizationImage`,
    body
  );
};

export const getAllStockPrices = async (symbol: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_ARG_DATA}stocks/${symbol}/allPrices`
  );
};

interface UpdatePriceBody {
  date: string;
  value: number;
  market: string;
  symbol: string;
}

export const updateItemPrice = async (body: UpdatePriceBody) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_ARG_DATA}stocks/${body.symbol}/price`,
    body
  );
};
