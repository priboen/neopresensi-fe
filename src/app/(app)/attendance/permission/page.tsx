"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";
import PermissionTable from "./_components/PermissionTable";
import { UserPermission } from "@/models/user-permission.model";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/permissions`;

export default function PermissionPage() {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await authFetch(API_URL);
      const json = await res.json();

      if (!res.ok || json.statusCode !== 200) {
        console.error(json.message);
        setPermissions([]);
        return;
      }

      const mapped = json.data.map((item: any) =>
        UserPermission.fromJson(item)
      );

      setPermissions(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);
  return (
    <>
      <Breadcrumb pageName="Pengajuan Perizinan" />
      <div className="space-y-10">
        {loading ? (
          <SkeletonTable
            title="Data Pengajuan Izin"
            rowCount={5}
            columns={[
              { label: "Nama", align: "left" },
              { label: "Alasan" },
              { label: "Mulai Izin" },
              { label: "Akhir Izin" },
              { label: "Status" },
            ]}
          />
        ) : permissions.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-base text-dark dark:bg-gray-dark dark:text-white shadow-md">
            Tidak ada data perizinan saat ini
          </div>
        ) : (
          <PermissionTable
            permissions={permissions}
            onRefresh={fetchPermissions}
          />
        )}
      </div>
    </>
  );
}
