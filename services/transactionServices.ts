import axiosInstance from "@/utils/axiosInstance";

interface createTransactionBody {
  symbol: string;
  amount_sold: number;
  transaction_type: "buy" | "sell";
  transaction_date: string;
  symbol_price: number;
}

export const createTransaction = (body: createTransactionBody) => {
  return axiosInstance.post("transactions/createTransaction", body);
};
