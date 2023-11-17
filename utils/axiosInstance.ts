import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Aquí necesitas verificar si estás en el lado del servidor o del cliente
    const isServerSide = typeof window === "undefined";
    if (isServerSide) return config;
    const session = await getSession();
    console.log("SESSION", session);
    if (session?.user.accessToken) {
      // Asumiendo que el token de acceso se almacena directamente en el objeto de sesión
      config.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
