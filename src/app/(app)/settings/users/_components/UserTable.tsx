"use client";
import { AppUser } from "@/models/app-user.model";
import { SearchIcon, TrashIcon } from "@/assets/icons";
import { useState } from "react";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { UpdateDialog } from "@/components/Dialog/UpdateDialog";
import { EditIcon } from "@/components/Tables/icons";

type Props = {
  users: AppUser[];
  onRefresh: () => void;
};

export default function UserTable({ users, onRefresh }: Props) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleEditClick = (uuid: string) => {
    setSelectedUuid(uuid);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (uuid: string) => {
    setSelectedUuid(uuid);
    setOpenDeleteDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUuid(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUuid(null);
  };

  const handleSuccess = () => {
    onRefresh(); // Refresh the table after a successful update
    handleCloseEditDialog(); // Close the dialog after success
  };

  const formAddUser = [
    {
      name: "name",
      type: "text",
      label: "Nama Guru",
      placeholder: "Masukkan Nama Guru",
      required: true,
    },
    {
      name: "username",
      type: "text",
      label: "Username Guru",
      placeholder: "Masukkan Username Guru",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email Guru",
      placeholder: "Masukkan Email Guru",
      required: true,
    },
    {
      name: "role",
      type: "select",
      label: "Jabatan Guru",
      options: [
        { value: "teacher", label: "Guru" },
        { value: "admin", label: "Admin/Staff" },
      ],
      placeholder: "Pilih Jabatan Guru",
      required: true,
      defaultValue: "",
    },
    {
      name: "password",
      type: "password",
      label: "Password Guru",
      placeholder: "Masukkan Password Guru",
      required: true,
    },
  ];

  const formEditUser = [
    {
      name: "name",
      type: "text",
      label: "Nama Guru",
      placeholder: "Masukkan Nama Guru",
      required: true,
      defaultValue: "",
    },
    {
      name: "username",
      type: "text",
      label: "Username Guru",
      placeholder: "Masukkan Username Guru",
      required: true,
      defaultValue: "",
    },
    {
      name: "email",
      type: "email",
      label: "Email Guru",
      placeholder: "Masukkan Email Guru",
      required: true,
      defaultValue: "",
    },
    {
      name: "role",
      type: "select",
      label: "Jabatan Guru",
      options: [
        { value: "teacher", label: "Guru" },
        { value: "admin", label: "Admin/Staff" },
      ],
      placeholder: "Pilih Jabatan Guru",
      required: true,
      defaultValue: "",
    },
  ];

  const sortedUsers = [...users].sort((a, b) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" })
  );

  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Guru"
        formData={formAddUser}
        endpoint="/users"
        onSuccess={() => {
          onRefresh();
          handleCloseAddDialog();
        }}
      />
      <UpdateDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSuccess={handleSuccess}
        formTitle="Edit Data Guru dan Staff"
        formData={formEditUser}
        endpoint={`/users/${selectedUuid}`}
        initialData={
          sortedUsers.find((perm) => perm.uuid === selectedUuid) || {}
        }
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        entityUuid={selectedUuid}
        entityName="Guru dan Staff"
        endpoint="/users"
        onSuccess={onRefresh}
      />
      <CustomTable<AppUser>
        title="Data Akun Guru dan Staff"
        data={sortedUsers}
        rowKey="uuid"
        logoAccessor="photoUrl"
        columns={[
          { label: "Nama", accessor: "name", align: "left" },
          { label: "Email", accessor: "email" },
          { label: "Username", accessor: "username" },
          { label: "Role", accessor: "role" },
        ]}
        renderActions={(user) => (
          <div className="flex items-center justify-end gap-3.5">
            <button
              onClick={() => handleEditClick(user.uuid)}
              className="hover:text-primary"
            >
              <span className="sr-only">Edit</span>
              <EditIcon />
            </button>
            <button
              onClick={() => handleDeleteClick(user.uuid)}
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
              shape="full"
              onClick={() => handleAddClick()}
            />
          </>
        }
      />
    </>
  );
}
