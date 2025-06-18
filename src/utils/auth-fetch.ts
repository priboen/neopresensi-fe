import { useAuthStore } from "@/lib/stores/use-auth-store";
import toast from "react-hot-toast";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  if (!token) {
    toast.error("Sesi telah habis, silakan login kembali");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("No authentication token");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    toast.error("Sesi telah habis, silakan login kembali");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (response.status === 404) {
    toast.error("Endpoint tidak ditemukan");
    throw new Error("Endpoint not found");
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Non-JSON response: ${response.statusText}`);
    }
  }

  return response;
};
