"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { ClassGroup } from "@/models/class-group.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import GroupTable from "./_components/GroupTable";
import { AddDialog } from "@/components/Dialog/AddDialog";
import { Button } from "@/components/ui/button";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/class-group`;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(API_URL);
      const json = await res.json();

      if (!res.ok || json.statusCode !== 200) {
        throw new Error(json.message);
      }

      const mapped = json.data.map(ClassGroup.fromJson);

      setGroups(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Terjadi kesalahan saat memuat data.");
      setGroups([]);
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
    fetchGroups();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Data Rombongan Belajar" />
      <div className="space-y-10">
        {error && (
          <div className="rounded-md bg-red-500 text-white p-4">{error}</div>
        )}
        {loading ? (
          <SkeletonTable
            title="Data Rombongan Belajar"
            rowCount={3}
            columns={[
              {
                label: "Nama Rombel",
                align: "left",
              },
              {
                label: "Aksi",
                align: "left",
              },
            ]}
          />
        ) : groups.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-base text-dark dark:bg-gray-dark dark:text-white shadow-md">
            <p>Tidak ada data rombel yang ditemukan.</p>
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
              endpoint="/class-group"
              onSuccess={() => {
                fetchGroups();
                handleCloseAddDialog();
              }}
            />
          </div>
        ) : (
          <GroupTable groups={groups} onRefresh={fetchGroups} />
        )}
      </div>
    </>
  );
}
