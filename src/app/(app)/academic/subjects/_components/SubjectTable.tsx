"use client";

import { AddDialog } from "@/components/Dialog/AddDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { Subjects } from "@/models/subjects.model";
import { useState } from "react";

type Props = {
  subjects: Subjects[];
  onRefresh: () => void;
};

export default function SubjectTable({ subjects, onRefresh }: Props) {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleDeleteClick = (uuid: string) => {
    setSelectedUuid(uuid);
    setOpenDeleteDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUuid(null);
  };

  const sorted = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" })
  );

  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Mata Pelajaran"
        formData={[
          { name: "name", type: "text", label: "Nama Mata Pelajaran" },
        ]}
        endpoint="/subjects"
        onSuccess={() => {
          onRefresh();
          handleCloseAddDialog();
        }}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        entityUuid={selectedUuid}
        entityName="Mata Pelajaran"
        endpoint="/subjects"
        onSuccess={onRefresh}
      />
      <CustomTable<Subjects>
        title="Data Mata Pelajaran"
        data={sorted}
        rowKey="uuid"
        columns={[
          {
            label: "Nama Mata Pelajaran",
            accessor: "name",
            align: "left",
          },
        ]}
        renderActions={(cls) => (
          <button
            onClick={() => handleDeleteClick(cls.uuid)}
            className="text-red-600 hover:text-red-800"
          >
            Hapus
          </button>
        )}
        headerExtras={
          <>
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
