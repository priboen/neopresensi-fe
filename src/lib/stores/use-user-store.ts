import { create } from "zustand";
import { AppUser } from "@/models/app-user.model";
import { authFetch } from "@/utils/auth-fetch";

type UserStore = {
  users: AppUser[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      console.log("📦 fetchUsers triggered (no persist)");
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`
      );
      const json = await res.json();
      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message || "Gagal mengambil data pengguna");
      }
      const users = json.data.map(AppUser.fromJson);
      set({ users, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
