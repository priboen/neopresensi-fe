"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { useState } from "react";
import toast from "react-hot-toast";

type UserFormProps = {
  onSuccess?: () => void;
};

const translateError = (message: string): string => {
  if (message.includes("should not exist")) {
    if (message.includes("name")) return "Field 'Nama' tidak seharusnya ada";
    if (message.includes("email")) return "Field 'Email' tidak seharusnya ada";
    return "Properti tidak seharusnya ada";
  }

  const translations: { [key: string]: string } = {
    "Name should be at least 1 characters long":
      "Nama harus memiliki minimal 1 karakter",
    "name should not be empty": "Nama tidak boleh kosong",
    "name must be a string": "Nama harus berupa teks",
    "Username should not exceed 25 characters":
      "Username tidak boleh lebih dari 25 karakter",
    "Username should be at least 2 characters long":
      "Username harus memiliki minimal 2 karakter",
    "username should not be empty": "Username tidak boleh kosong",
    "username must be a string": "Username harus berupa teks",
    "email should not be empty": "Email tidak boleh kosong",
    "email must be an email": "Format email tidak valid",
    "Password must contain at least one uppercase letter, one number, and one special character":
      "Password harus mengandung huruf kapital, angka, dan karakter spesial",
    "Password should be at least 6 characters long":
      "Password minimal terdiri dari 6 karakter",
    "password should not be empty": "Password tidak boleh kosong",
    "password must be a string": "Password harus berupa teks",
    "Username or email already exists":"Username atau email sudah terdaftar",
  };

  return translations[message] || message;
};

export function UserForm({ onSuccess }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const username = formData.get("username")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    if (password !== confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            email,
            password,
          }),
        }
      );

      const json = await res.json();

      if (res.status === 201) {
        toast.success(
          json.message.includes("Registration successful")
            ? "Guru berhasil didaftarkan"
            : translateError(json.message)
        );
      } else if (res.status === 400 && Array.isArray(json.message)) {
        const translated = json.message.map(translateError).join(", ");
        toast.error(translated);
      } else if (res.status === 409) {
        toast.error(translateError(json.message));
      } else {
        toast.error("Terjadi kesalahan saat mendaftar");
      }
    } catch (error) {
      toast.error("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputGroup
        label="Nama Lengkap"
        name="name"
        type="text"
        placeholder="Masukkan nama lengkap"
      />

      <InputGroup
        label="Username"
        name="username"
        type="text"
        placeholder="Masukkan username"
      />

      <InputGroup
        label="Email"
        name="email"
        type="email"
        placeholder="Masukkan email"
      />

      <InputGroup
        label="Password"
        name="password"
        type="password"
        placeholder="Masukkan password"
      />

      <InputGroup
        label="Konfirmasi Password"
        name="confirmPassword"
        type="password"
        placeholder="Ulangi password"
      />

      <button
        type="submit"
        disabled={loading}
        className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
