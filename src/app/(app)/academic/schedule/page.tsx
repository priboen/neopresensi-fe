"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/models/schedules.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import ScheduleTable from "./_components/ScheduleTable";
import TimePicker from "react-time-picker";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/schedules`;

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(API_URL);
      const json = await res.json();
      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message);
      }
      const mapped = json.data.map(Schedule.fromJson);
      setSchedules(mapped);
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };
  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
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
      fetchField: "userName",
      placeholder: "Pilih Mata Pelajaran",
      required: true,
    },
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Data Semua Jadwal" />
      <div className="space-y-10">
        {error && (
          <div className="rounded-md bg-red-500 text-white p-4">{error}</div>
        )}
        {loading ? (
          <SkeletonTable
            title="Data Mata Pelajaran"
            rowCount={6}
            columns={[
              {
                label: "Hari",
                align: "left",
              },
              {
                label: "Jam Mulai",
                align: "left",
              },
              {
                label: "Jam Selesai",
                align: "left",
              },
              {
                label: "Kelas",
                align: "left",
              },
              {
                label: "Mata Pelajaran",
                align: "left",
              },
              {
                label: "Guru",
                align: "left",
              },
            ]}
          />
        ) : schedules.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-base text-dark dark:bg-gray-dark dark:text-white shadow-md">
            <p>Tidak ada jadwal yang ditemukan.</p>
            <Button
              label="Tambah"
              variant="primary"
              shape="full"
              onClick={handleAddClick}
              className="mt-4"
            />
            <AddDialog
              open={openAddDialog}
              onClose={handleCloseAddDialog}
              formTitle="Tambah Jadwal Mata Pelajaran"
              formData={formData}
              endpoint="/schedules"
              onSuccess={() => {
                fetchSchedule();
                handleCloseAddDialog();
              }}
            />
          </div>
        ) : (
          <ScheduleTable schedule={schedules} onRefresh={fetchSchedule} />
        )}
      </div>
    </>
  );
}
