"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/stores/use-auth-store";

type DeleteUserDialogProps = {
  open: boolean;
  onClose: () => void;
  userUuid: string | null;
  onSuccess?: () => void;
};

export function DeleteUserDialog({
  open,
  onClose,
  userUuid,
  onSuccess,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleDelete = async () => {
    if (!userUuid || !token) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userUuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (res.ok) {
        toast.success("Pengguna berhasil dihapus");
        onClose();
        onSuccess?.();
      } else {
        toast.error(json.message || "Gagal menghapus pengguna");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghapus");
    } finally {
      setLoading(false);
    }
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-dark">
                <DialogTitle className="text-lg font-medium text-dark dark:text-white mb-4">
                  Hapus Pengguna
                </DialogTitle>
                <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
                  Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak
                  dapat dibatalkan.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-white dark:border-white/20 dark:hover:bg-white/10"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? "Menghapus..." : "Iya"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
