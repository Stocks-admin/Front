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
  offset?: number;
  limit?: number;
  token?: string;
}
export const getUserTransactions = async ({
  offset,
  limit,
  token,
}: ITransaction) => {
  return await axiosInstance.get("transactions/userTransactions", {
    params: {
      offset,
      limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
