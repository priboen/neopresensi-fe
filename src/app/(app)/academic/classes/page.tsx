"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { Classes } from "@/models/classes.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import ClassesTable from "./_components/ClassesTable";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { Button } from "@/components/ui/button";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/classes`;

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(API_URL);
      const json = await res.json();
      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message);
      }
      const mapped = json.data.map(Classes.fromJson);
      setClasses(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Terjadi kesalahan saat memuat data.");
      setClasses([]);
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

  useEffect(() => {
    fetchClasses();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Data Seluruh Kelas" />
      <div className="space-y-10">
        {error && (
          <div className="rounded-md bg-red-500 text-white p-4">{error}</div>
        )}
        {loading ? (
          <SkeletonTable
            title="Data Kelas"
            rowCount={2}
            columns={[
              {
                label: "Nama Kelas",
                align: "left",
              },
              {
                label: "Aksi",
                align: "left",
              },
            ]}
          />
        ) : classes.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-base text-dark dark:bg-gray-dark dark:text-white shadow-md">
            <p>Tidak ada data kelas yang ditemukan.</p>
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
              endpoint="/classes"
              relatedEndpoint={undefined}
              relatedField={undefined}
              onSuccess={() => {
                fetchClasses();
                handleCloseAddDialog();
              }}
            />
          </div>
        ) : (
          <ClassesTable classes={classes} onRefresh={fetchClasses} />
        )}
      </div>
    </>
  );
}
