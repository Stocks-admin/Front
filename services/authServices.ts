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

export const impersonate = async (user_id: number) => {
  return await axiosInstance.post("auth/impersonate", { user_id });
};

export const forgotPassword = async (email: string) => {
  return await axiosInstance.post("auth/start-password-recovery", { email });
};

export const resetPassword = async (password: string, token: string) => {
  return await axiosInstance.post("auth/reset-password", {
    password,
    token,
  });
};
