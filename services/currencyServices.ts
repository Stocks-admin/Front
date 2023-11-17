import axiosInstance from "@/utils/axiosInstance";

export const getCurrentDollarValue = async () => {
  return await axiosInstance.get("currencies/dolar");
};
