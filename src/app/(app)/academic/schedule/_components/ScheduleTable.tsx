"use";

import { AddDialog } from "@/components/Dialog/AddDialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";
import { CustomTable } from "@/components/Tables";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/models/schedules.model";
import { useState } from "react";

type Props = {
  schedule: Schedule[];
  onRefresh: () => void;
};

export default function ScheduleTable({ schedule, onRefresh }: Props) {
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
      name: "day",
      type: "select",
      label: "Hari",
      options: [
        { value: "Senin", label: "Senin" },
        { value: "Selasa", label: "Selasa" },
        { value: "Rabu", label: "Rabu" },
        { value: "Kamis", label: "Kamis" },
        { value: "Jumat", label: "Jumat" },
        { value: "Sabtu", label: "Sabtu" },
      ],
      placeholder: "Pilih Hari",
      required: true,
    },
    {
      name: "start_time",
      type: "time",
      label: "Jam Masuk",
      placeholder: "Pilih Jam Masuk",
      required: true,
    },
    {
      name: "end_time",
      type: "time",
      label: "Jam Selesai",
      placeholder: "Pilih Jam Selesai",
      required: true,
    },
    {
      name: "teacher_id",
      type: "select",
      label: "Guru - Mapel -Kelas",
      fetchEndpoint: "/teacher-assignments",
      fetchField: "name",
      placeholder: "Pilih Mata Pelajaran",
      required: true,
    },
  ];

  const sorted = [...schedule].sort((a, b) =>
    a.day.localeCompare(b.day, "id", { sensitivity: "base" })
  );

  return (
    <>
      <AddDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        formTitle="Tambah Jadwal"
        formData={formData}
        endpoint="/schedules"
        onSuccess={() => {
          onRefresh();
          handleCloseAddDialog();
        }}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        entityUuid={selectedUuid}
        entityName="Jadwal Mata Pelajaran"
        endpoint="/schedules"
        onSuccess={onRefresh}
      />
      <CustomTable<Schedule>
        title="Jadwal Mata Pelajaran"
        data={sorted}
        rowKey="uuid"
        columns={[
          {
            label: "Hari",
            accessor: "day",
            align: "left",
          },
          {
            label: "Jam Mulai",
            accessor: "startTime",
            align: "left",
          },
          {
            label: "Jam Selesai",
            accessor: "endTime",
            align: "left",
          },
          {
            label: "Kelas",
            accessor: (row: Schedule) =>
              row.teacherAssignment.classes.gradeGroup || "-",
            align: "left",
          },
          {
            label: "Mata Pelajaran",
            accessor: (row: Schedule) =>
              row.teacherAssignment.subject.name || "-",
            align: "left",
          },
          {
            label: "Guru",
            accessor: (row: Schedule) => row.teacherAssignment.user.name || "-",
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
