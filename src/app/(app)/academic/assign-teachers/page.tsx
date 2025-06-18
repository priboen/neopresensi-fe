"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import TeacherAssignTable from "./_components/TeacherAssignTable";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/Tables/skeleton";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/teacher-assignments`;

export default function AssignTeachersPage() {
  const [teacherAssignments, setTeacherAssignment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchTeacherAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(API_URL);
      const json = await res.json();
      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message);
      }
      const mapped = json.data.map((item: any) => ({
        ...item,
        userName: item.user?.name ?? "-",
        userPhotoUrl: item.user?.photo_url ?? null,
        subjectName: item.subject?.name ?? "-",
      }));
      setTeacherAssignment(mapped);
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data.");
      setTeacherAssignment([]);
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
      label: "Kelas yang diampu",
      fetchEndpoint: "/classes",
      fetchField: "gradeGroup",
      placeholder: "Pilih Kelas",
      required: true,
    },
    {
      name: "subject_id",
      type: "select",
      label: "Nama Mata Pelajaran",
      fetchEndpoint: "/subjects",
      fetchField: "name",
      placeholder: "Pilih Mata Pelajaran",
      required: true,
    },
  ];

  useEffect(() => {
    fetchTeacherAssignments();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Data Guru yang mengampu Mata Pelajaran" />
      <div className="space-y-10">
        {error && (
          <div className="rounded-md bg-red-500 text-white p-4">{error}</div>
        )}
        {loading ? (
          <SkeletonTable
            title="Data Guru yang mengampu Mata Pelajaran"
            rowCount={4}
            columns={[
              {
                label: "Nama Guru",
                align: "left",
              },
              {
                label: "Nama Mata Pelajaran",
                align: "left",
              },
              {
                label: "Kelas",
                align: "left",
              },
              {
                label: "Aksi",
                align: "left",
              },
            ]}
          />
        ) : teacherAssignments.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-base text-dark dark:bg-gray-dark dark:text-white shadow-md">
            <p>Tidak ada data mata pelajaran yang ditemukan.</p>
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
              formTitle="Tambah Mata Pelajaran"
              formData={formData}
              endpoint="/teacher-assignments"
              onSuccess={() => {
                fetchTeacherAssignments();
                handleCloseAddDialog();
              }}
            />
          </div>
        ) : (
          <TeacherAssignTable
            teacherAssignments={teacherAssignments}
            onRefresh={fetchTeacherAssignments}
          />
        )}
      </div>
    </>
  );
}
