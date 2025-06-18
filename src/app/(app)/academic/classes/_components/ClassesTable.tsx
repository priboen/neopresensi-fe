"use client";

import { AddDialog } from "@/components/Dialog/AddDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { Classes } from "@/models/classes.model";
import { useState } from "react";

type Props = {
  classes: Classes[];
  onRefresh: () => void;
};

export default function ClassesTable({ classes, onRefresh }: Props) {
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

  const formData = [
    {
      name: "grade",
      type: "number",
      label: "Tingkat Kelas",
      placeholder: "Masukkan tingkat kelas (mis. 7)",
      required: true,
    },
    {
      name: "group_id",
      type: "select",
      label: "Kelompok Kelas",
      fetchEndpoint: "/class-group",
      fetchField: "name",
      placeholder: "Pilih kelompok kelas",
      required: true,
    },
  ];

  const sorted = [...classes].sort((a, b) =>
    a.gradeGroup.localeCompare(b.gradeGroup, "id", { sensitivity: "base" })
  );

  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Kelas"
        formData={formData}
        endpoint="/classes"
        relatedEndpoint={undefined}
        relatedField={undefined}
        onSuccess={() => {
          onRefresh();
          handleCloseAddDialog();
        }}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        entityUuid={selectedUuid}
        entityName="Kelas"
        endpoint="/classes"
        onSuccess={onRefresh}
      />
      <CustomTable<Classes>
        title="Daftar Kelas"
        data={sorted}
        rowKey="uuid"
        columns={[
          {
            label: "Nama Kelas",
            accessor: "gradeGroup",
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
