"use client";

import { UpdateUserForm } from "@/app/(app)/user/_components/update-user-form";
import { AppUser } from "@/models/app-user.model";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  open: boolean;
  user: AppUser | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export function UpdateUserDialog({ open, user, onClose, onSuccess }: Props) {
  if (!user) return null;
  return (
    <>
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
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium text-dark dark:text-white mb-4"
                  >
                    Ubah Guru atau Staff
                  </DialogTitle>
                  <UpdateUserForm
                    userId={user.uuid}
                    defaultValues={{
                      name: user.name,
                      username: user.username,
                      email: user.email,
                      role: user.role,
                    }}
                    onSuccess={() => {
                      onClose();
                      onSuccess?.();
                    }}
                  />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
