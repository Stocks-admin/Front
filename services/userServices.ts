import axiosInstance from "@/utils/axiosInstance";

export const getUserPortfolio = async (token: string = "") => {
  return await axiosInstance.get("user/portfolio", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserWallet = async (token: string = "") => {
  return await axiosInstance.get("user/wallet", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

interface ITransaction {
  symbol?: string;
  offset?: number;
  limit?: number;
  token?: string;
}
export const getUserTransactions = async ({
  symbol,
  offset,
  limit,
  token,
}: ITransaction) => {
  return await axiosInstance.get("transactions/userTransactions", {
    params: {
      symbol,
      offset,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserBenchmark = async (token: string = "") => {
  return await axiosInstance.get("user/benchmark", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
