import axiosInstance from "@/utils/axiosInstance";

interface createTransactionBody {
  symbol: string;
  amount_sold: number;
  transaction_type: "buy" | "sell";
  transaction_date: string;
  currency: "ARS" | "USD";
  symbol_price: number;
}

export const createTransaction = (body: createTransactionBody) => {
  return axiosInstance.post("transactions/createTransaction", body);
};

export const createFakeTransactions = () => {
  return axiosInstance.post("fake-transactions");
};

export const createMassiveTransactions = (body: FormData) => {
  return axiosInstance.post("transactions/massiveCreateTransaction", body);
};

export const createMassiveTransactionsCocos = (body: FormData) => {
  return axiosInstance.post("transactions/massiveCreateTransactionCocos", body);
};

export const deleteTransaction = (id: number) => {
  return axiosInstance.delete(`transactions/deleteTransaction/${id}`);
};

export const cleanUserTransactions = () => {
  return axiosInstance.delete("transactions/deleteAllTransactions");
};
