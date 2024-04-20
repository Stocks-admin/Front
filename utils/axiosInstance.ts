import axios from "axios";
import { getCookie, deleteCookie, hasCookie } from "cookies-next";
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

    let impToken;
    impToken = getCookie("x-impersonated-token");
    console.log("IMP TOKEN", impToken);
    console.log("method", config.method);
    if (
      impToken &&
      (config.method === "get" || config.url === "auth/impersonate")
    ) {
      config.headers["Authorization"] = `Bearer ${impToken}`;
    } else if (impToken && config.method !== "get") {
      console.error("Impersonation token only works with GET requests");
      return Promise.reject("Impersonation token only works with GET requests");
    } else if (session?.user?.accessToken) {
      // Asumiendo que el token de acceso se almacena directamente en el objeto de sesión
      const impToken = getCookie("x-impersonated-token");
      if (impToken) {
        deleteCookie("x-impersonated-token");
        alert("Impersonation ended");
      }
      config.headers["Authorization"] = `Bearer ${session?.user?.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
