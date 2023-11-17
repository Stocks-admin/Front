import axiosInstance from "@/utils/axiosInstance";

export const refreshAccessToken = async (refreshToken: string = "") => {
  return await axiosInstance.post("auth/refresh", {
    refresh_token: refreshToken,
  });
};

export const logout = async () => {
  return await axiosInstance.post("auth/logout");
};

interface registerData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export const register = async (data: registerData) => {
  return await axiosInstance.post("auth/register", data);
};
