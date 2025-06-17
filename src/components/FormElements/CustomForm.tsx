"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import InputGroup from "@/components/FormElements/InputGroup";
import { authFetch } from "@/utils/auth-fetch";

type CustomFormProps = {
  formData: { name: string; type: string }[];
  onSuccess?: () => void;
  onClose: () => void;
  endpoint: string;
};

export function CustomForm({
  formData,
  onSuccess,
  onClose,
  endpoint,
}: CustomFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj: { [key: string]: string } = {};
    formData.forEach(({ name }) => {
      formDataObj[name] =
        (e.currentTarget.elements.namedItem(name) as HTMLInputElement)?.value ||
        "";
    });

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          body: JSON.stringify(formDataObj),
        }
      );
      const json = await res.json();
      if (json.statusCode === 201) {
        toast.success("Data berhasil disimpan!");
        onSuccess?.();
        onClose();
      } else if (json.statusCode === 400 && Array.isArray(json.message)) {
        toast.error(json.message.join(", "));
      } else {
        toast.error("Terjadi kesalahan: " + json.message);
      }
    } catch (error) {
      toast.error("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formData.map((field, idx) => (
        <InputGroup
          key={idx}
          label={field.name}
          name={field.name}
          type={field.type}
          placeholder={`Masukkan ${field.name}`}
        />
      ))}
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
