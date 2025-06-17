"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { ClassGroup } from "@/models/class-group.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import GroupTable from "./_components/GroupTable";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/class-group`;

export default function GroupPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
            Tidak ada data rombongan belajar yang ditemukan.
          </div>
        ) : (
          <GroupTable groups={groups} onRefresh={fetchGroups} />
        )}
      </div>
    </>
  );
}
