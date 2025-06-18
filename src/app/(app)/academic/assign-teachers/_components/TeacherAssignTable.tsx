import { AddDialog } from "@/components/Dialog/AddDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { TeacherAssignment } from "@/models/teacher-assignment.model";
import { useState } from "react";

type Props = {
  teacherAssignments: TeacherAssignment[];
  onRefresh: () => void;
};

export default function TeacherAssignTable({
  teacherAssignments,
  onRefresh,
}: Props) {
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
      name: "user_id",
      type: "select",
      label: "Nama Guru",
      fetchEndpoint: "/users",
      fetchField: "name",
      placeholder: "Pilih nama guru",
      required: true,
    },
    {
      name: "class_id",
      type: "select",
      label: "Kelas",
      fetchEndpoint: "/classes",
      fetchField: "gradeGroup",
      placeholder: "Pilih kelas",
      required: true,
    },
    {
      name: "subject_id",
      type: "select",
      label: "Mata Pelajaran",
      fetchEndpoint: "/subjects",
      fetchField: "name",
      placeholder: "Pilih mata pelajaran",
      required: true,
    },
  ];

  const sorted = [...teacherAssignments].sort((a, b) =>
    a.userName.localeCompare(b.userName, "id", { sensitivity: "base" })
  );
  console.log("TeacherAssignTable sorted", sorted);
  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Kelas"
        formData={formData}
        endpoint="/teacher-assignments"
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
        entityName="Penugasan Guru"
        endpoint="/teacher-assignments"
        onSuccess={onRefresh}
      />
      <CustomTable<TeacherAssignment>
        title="Data Penugasan Guru"
        data={sorted}
        rowKey="uuid"
        logoAccessor="userPhotoUrl"
        columns={[
          {
            label: "Nama Guru",
            accessor: "userName",
            align: "left",
          },
          {
            label: "Mata Pelajaran",
            accessor: "subjectName",
            align: "left",
          },
          {
            label: "Kelas",
            accessor: (row: any) =>
              `${row.classes?.grade || 0} ${row.classes?.group?.name || ""}`,
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
