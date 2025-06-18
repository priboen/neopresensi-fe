"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { authFetch } from "@/utils/auth-fetch";

type FormField = {
  name: string;
  type: string;
  options?: { value: string; label: string }[];
  fetchEndpoint?: string;
  fetchField?: string;
  mapOptions?: (data: any[]) => { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  required?: boolean;
};

type CustomFormProps = {
  formData: FormField[];
  onSuccess?: () => void;
  onClose: () => void;
  endpoint: string;
  additionalData?: { [key: string]: any };
};

export function CustomForm({
  formData,
  onSuccess,
  onClose,
  endpoint,
  additionalData,
}: CustomFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<{
    [key: string]: { value: string; label: string }[];
  }>({});
  const [isFetching, setIsFetching] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      toast.error("Konfigurasi API tidak valid");
      return;
    }
    const fetchOptions = async () => {
      const newFetchedOptions: {
        [key: string]: { value: string; label: string }[];
      } = {};
      const newIsFetching: { [key: string]: boolean } = {};

      for (const field of formData) {
        if (field.fetchEndpoint) {
          const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${field.fetchEndpoint}`;
          newIsFetching[field.name] = true;
          try {
            const response = await authFetch(fullUrl);
            if (!response.ok) {
              throw new Error(
                `HTTP error ${response.status}: ${response.statusText}`
              );
            }
            const json = await response.json();
            if (json.statusCode === 200 && Array.isArray(json.data)) {
              newFetchedOptions[field.name] = field.mapOptions
                ? field.mapOptions(json.data)
                : json.data.map((item: any) => ({
                    value: item.uuid,
                    label: item[field.fetchField!],
                  }));
            } else {
              throw new Error("Invalid response format");
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            toast.error(
              `Gagal memuat opsi untuk ${
                field.label || field.name
              }: ${errorMessage}`
            );
            newFetchedOptions[field.name] = [];
          } finally {
            newIsFetching[field.name] = false;
          }
        }
      }
      setFetchedOptions(newFetchedOptions);
      setIsFetching(newIsFetching);
    };
    fetchOptions();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj: { [key: string]: any } = {};
    formData.forEach(({ name, type }) => {
      const value =
        (e.currentTarget.elements.namedItem(name) as HTMLInputElement)?.value ||
        "";
      if (type === "number") {
        formDataObj[name] = value ? parseInt(value, 10) : undefined;
      } else {
        formDataObj[name] = value;
      }
    });

    const requiredFields = formData.filter((field) => field.required);
    for (const field of requiredFields) {
      if (!formDataObj[field.name]) {
        toast.error(`${field.label || field.name} harus diisi`);
        setLoading(false);
        return;
      }
    }

    if (additionalData) {
      Object.assign(formDataObj, additionalData);
    }

    try {
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
      const res = await authFetch(fullUrl, {
        method: "POST",
        body: JSON.stringify(formDataObj),
      });
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Gagal menghubungi server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formData.map((field, idx) => {
        if (field.type === "select") {
          const options = field.options || fetchedOptions[field.name] || [];
          return (
            <Select
              key={idx}
              label={field.label || field.name}
              name={field.name}
              items={options}
              placeholder={
                isFetching[field.name]
                  ? "Memuat opsi..."
                  : field.placeholder || `Pilih ${field.name}`
              }
              disabled={isFetching[field.name]}
            />
          );
        }

        return (
          <InputGroup
            key={idx}
            label={field.label || field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder || `Masukkan ${field.name}`}
          />
        );
      })}

      <button
        type="submit"
        className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
