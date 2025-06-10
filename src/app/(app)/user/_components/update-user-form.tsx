"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { useAuthStore } from "@/lib/stores/use-auth-store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type UpdateUserProps = {
  userId: string;
  defaultValues: {
    name: string;
    username: string;
    email: string;
    role: string;
    password?: string;
    confirmPassword?: string;
  };
  onSuccess?: () => void;
};

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Guru", value: "guru" },
];

export function UpdateUserForm({
  userId,
  defaultValues,
  onSuccess,
}: UpdateUserProps) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    name: defaultValues.name,
    username: defaultValues.username,
    email: defaultValues.email,
    role: defaultValues.role,
    password: "",
    confirmPassword: "",
  });

  const translateError = (message: string): string => {
    const translations: Record<string, string> = {
      "Password must contain at least one uppercase letter, one number, and one special character":
        "Password harus mengandung setidaknya satu huruf kapital, satu angka, dan satu karakter spesial",
      "Password should be at least 6 characters long":
        "Password harus terdiri dari minimal 6 karakter",
    };

    return translations[message] || message;
  };

  useEffect(() => {
    setFormData({
      name: defaultValues.name,
      username: defaultValues.username,
      email: defaultValues.email,
      role: defaultValues.role,
      password: "",
      confirmPassword: "",
    });
  }, [defaultValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error("Password dan konfirmasi password tidak sama");
        setLoading(false);
        return;
      }

      const { confirmPassword, ...payload } = formData;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (res.ok) {
        toast.success("Pengguna berhasil diperbarui");
        onSuccess?.();
      } else {
        if (Array.isArray(json?.message)) {
          const translated = json.message.map(translateError).join(", ");
          toast.error(translated);
        } else {
          toast.error(
            translateError(json?.message || "Gagal memperbarui pengguna")
          );
        }
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
        value={formData.name}
        onChange={handleChange}
      />

      <InputGroup
        label="Username"
        name="username"
        type="text"
        placeholder="Masukkan username"
        value={formData.username}
        onChange={handleChange}
      />

      <InputGroup
        label="Email"
        name="email"
        type="email"
        placeholder="Masukkan email"
        value={formData.email}
        onChange={handleChange}
      />

      <Select
        label="Jabatan"
        items={roleOptions}
        defaultValue={formData.role}
        placeholder="Pilih Jabatan"
        className="mb-5"
        value={formData.role}
        onChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
        name="role"
      />

      <InputGroup
        label="Password (opsional)"
        name="password"
        type="password"
        placeholder="Masukan password baru (kosongkan jika tidak ingin mengubah)"
        value={formData.password}
        onChange={handleChange}
      />

      <InputGroup
        label="Konfirmasi Password"
        name="confirmPassword"
        type="password"
        placeholder="Masukan Konfirmasi password baru"
        value={formData.confirmPassword}
        onChange={handleChange}
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
