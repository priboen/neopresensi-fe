"use client";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { ClassGroup } from "@/models/class-group.model";
import { useState } from "react";

type Props = {
  groups: ClassGroup[];
  onRefresh: () => void;
};

export default function GroupTable({ groups, onRefresh }: Props) {
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

  const sorted = [...groups].sort((a, b) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" })
  );
  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Grup"
        formData={[{ name: "name", type: "text" }]}
        endpoint="/class-group"
        onSuccess={() => {
          onRefresh();
          handleCloseAddDialog();
        }}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        entityUuid={selectedUuid}
        entityName="Grup"
        endpoint="/class-group"
        onSuccess={onRefresh}
      />
      <CustomTable<ClassGroup>
        title="Rombongan Belajar"
        data={sorted}
        rowKey="uuid"
        columns={[
          {
            label: "Nama Rombel",
            accessor: "name",
            align: "left",
          },
        ]}
        renderActions={(group) => (
          <button
            onClick={() => handleDeleteClick(group.uuid)}
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
