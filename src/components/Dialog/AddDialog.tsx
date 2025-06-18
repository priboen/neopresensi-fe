"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Select } from "@/components/FormElements/select";
import toast from "react-hot-toast";
import { authFetch } from "@/utils/auth-fetch";
import { CustomForm } from "../FormElements/CustomForm";

type AddDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  formTitle: string;
  formData: {
    name: string;
    type: any;
    options?: { value: string; label: string }[];
    fetchEndpoint?: string;
    fetchField?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
  }[];
  endpoint: string;
  relatedEndpoint?: string;
  relatedData?: { value: string; label: string }[];
  relatedField?: string;
  additionalData?: { [key: string]: any };
};

export function AddDialog({
  open,
  onClose,
  onSuccess,
  formTitle,
  formData,
  endpoint,
  relatedEndpoint,
  relatedData,
  relatedField,
  additionalData,
}: AddDialogProps) {
  const [relatedOptions, setRelatedOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedRelated, setSelectedRelated] = useState<string>("");
  const [isFetchingRelated, setIsFetchingRelated] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (relatedEndpoint) {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        toast.error("Konfigurasi API tidak valid");
        setFetchError("Konfigurasi API tidak valid");
        return;
      }
      const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${relatedEndpoint}`;
      const fetchRelatedData = async () => {
        setIsFetchingRelated(true);
        setFetchError(null);
        try {
          const response = await authFetch(fullUrl);
          if (!response.ok) {
            throw new Error(
              `HTTP error ${response.status}: ${response.statusText}`
            );
          }
          const json = await response.json();
          if (json.statusCode === 200 && Array.isArray(json.data)) {
            const options = json.data
              .map((item: any) => ({
                value: item.uuid,
                label: item[relatedField || "name"],
              }))
              .sort((a: { label: string }, b: { label: string }) =>
                a.label.localeCompare(b.label)
              );
            setRelatedOptions(options);
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          toast.error(`Gagal memuat data relasi: ${errorMessage}`);
          setFetchError(errorMessage);
          setRelatedOptions([]);
        } finally {
          setIsFetchingRelated(false);
        }
      };
      fetchRelatedData();
    } else if (relatedData) {
      setRelatedOptions(
        relatedData.sort((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label)
        )
      );
    }
  }, [relatedEndpoint, relatedData, relatedField]);

  const formAdditionalData = {
    ...additionalData,
    ...(selectedRelated && { relatedId: selectedRelated }),
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-dark">
                <DialogTitle className="text-lg font-medium text-dark dark:text-white mb-4">
                  {formTitle}
                </DialogTitle>
                {fetchError ? (
                  <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                    {fetchError}
                  </div>
                ) : relatedOptions.length > 0 ? (
                  <div className="mb-4">
                    <Select
                      label="Pilih Kelompok Kelas"
                      name="relatedField"
                      items={relatedOptions}
                      value={selectedRelated}
                      onChange={setSelectedRelated}
                      placeholder={
                        isFetchingRelated
                          ? "Memuat opsi..."
                          : "Pilih Kelompok Kelas"
                      }
                      disabled={isFetchingRelated}
                    />
                  </div>
                ) : null}
                <CustomForm
                  formData={formData}
                  onSuccess={onSuccess}
                  onClose={onClose}
                  endpoint={endpoint}
                  additionalData={formAdditionalData}
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
