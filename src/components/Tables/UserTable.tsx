"use client";
import { CustomTable } from ".";
import { AppUser } from "@/models/app-user.model";
import Link from "next/link";
import { EditIcon, PreviewIcon } from "./icons";
import { SearchIcon, TrashIcon } from "@/assets/icons";
import { useState } from "react";
import { UserForm } from "@/app/(app)/user/_components/user-form";
import { AddUserDialog } from "../Dialog/AddUserDialog";
import { Button } from "../ui/button";

type Props = {
  users: AppUser[];
};

export default function UserTable({ users }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = (uuid: string) => {
    console.log("🗑 Delete user with UUID:", uuid);
  };

  return (
    <>
      <AddUserDialog open={openDialog} onClose={() => setOpenDialog(false)} />
      <CustomTable<AppUser>
        title="Data Pengguna"
        data={users}
        rowKey={(user) => user.uuid}
        logoAccessor="photo_url"
        columns={[
          { label: "Nama", accessor: "name", align: "left" },
          { label: "Username", accessor: "username" },
          { label: "Role", accessor: "role" },
        ]}
        renderActions={(user) => (
          <div className="flex items-center justify-end gap-3.5">
            <Link href={`/user/${user.uuid}`} className="hover:text-primary">
              <span className="sr-only">Detail</span>
              <PreviewIcon className="h-5 w-5" />
            </Link>
            <Link
              href={`/user/edit/${user.uuid}`}
              className="hover:text-primary"
            >
              <span className="sr-only">Edit</span>
              <EditIcon className="h-5 w-5 " />
            </Link>
            <button
              onClick={() => handleDelete(user.uuid)}
              className="hover:text-primary"
            >
              <span className="sr-only">Delete</span>
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
        headerExtras={
          <>
            <div className="relative w-full max-w-[300px]">
              <input
                type="search"
                placeholder="Search"
                className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
              />
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
            </div>
            <Button
              label="Tambah"
              variant="primary"
              shape="rounded"
              onClick={() => setOpenDialog(true)}
            />
          </>
        }
      />
    </>
  );
}
