import { useAuthStore } from "@/lib/stores/use-auth-store";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};
