"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { Subjects } from "@/models/subjects.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import SubjectTable from "./_components/SubjectTable";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { Button } from "@/components/ui/button";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/subjects`;

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(API_URL);
      const json = await res.json();
      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message);
      }
      const mapped = json.data.map(Subjects.fromJson);
      setSubjects(mapped);
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data.");
      setSubjects([]);
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
  useEffect(() => {
    fetchSubjects();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Data Semua Mata Pelajaran" />
      <div className="space-y-10">
        {error && (
          <div className="rounded-md bg-red-500 text-white p-4">{error}</div>
        )}
        {loading ? (
          <SkeletonTable
            title="Data Mata Pelajaran"
            rowCount={2}
            columns={[
              {
                label: "Nama Mata Pelajaran",
                align: "left",
              },
              {
                label: "Aksi",
                align: "left",
              },
            ]}
          />
        ) : subjects.length === 0 ? (
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
              formData={[
                {
                  name: "name",
                  type: "text",
                  label: "Nama Mata Pelajaran",
                  required: true,
                },
              ]}
              endpoint="/subjects"
              onSuccess={() => {
                fetchSubjects();
                handleCloseAddDialog();
              }}
            />
          </div>
        ) : (
          <SubjectTable subjects={subjects} onRefresh={fetchSubjects} />
        )}
      </div>
    </>
  );
}
