"use client";
import { PasswordIcon, UserIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/use-auth-store";

export default function LoginWithPassword() {
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const AUTH_TOKEN_COOKIE_NAME =
    process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME || "fallbackAuthCookieName";
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "session_expired") {
      setError("Sesi Anda telah berakhir. Silakan login kembali.");
    } else if (errorParam === "config_error") {
      setError("Terjadi kesalahan konfigurasi. Hubungi administrator.");
    } else if (errorParam) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  }, [searchParams]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (AUTH_TOKEN_COOKIE_NAME === "fallbackAuthCookieName") {
      console.error("Nama cookie autentikasi tidak dikonfigurasi di .env!");
      setError("Kesalahan konfigurasi pada sisi klien.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        }
      );
      const resJson = await response.json();
      if (!response.ok || resJson.statusCode >= 400) {
        throw new Error(
          resJson.message ||
            "Login gagal. Periksa kembali username/password Anda."
        );
      }
      const { user, token } = resJson.data || {};
      if (!token) {
        throw new Error(
          "Login berhasil tetapi token tidak diterima dari server."
        );
      }
      const expiryDate = new Date();
      data.remember
        ? expiryDate.setDate(expiryDate.getDate() + 7)
        : expiryDate.setHours(expiryDate.getHours() + 1);
      document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`;
      useAuthStore.getState().login({ user, token });
      const redirectedFrom =
        new URLSearchParams(window.location.search).get("redirectedFrom") ||
        "/dashboard";
      router.push(redirectedFrom);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan tak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="Username"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Masukan username Anda"
        name="username"
        handleChange={handleChange}
        value={data.username}
        icon={<UserIcon />}
        disabled={loading}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Masukan password Anda"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
        disabled={loading}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Ingat saya"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
          checked={data.remember}
          disabled={loading}
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Lupa Password?
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-500 bg-red-100 p-3 text-center text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
          disabled={loading}
        >
          {loading ? "Sedang Memproses..." : "Masuk"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
