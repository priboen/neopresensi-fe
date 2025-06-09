"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import UserTable from "@/components/Tables/UserTable";
import { AppUser } from "@/models/app-user.model";
import { authFetch } from "@/utils/auth-fetch";
import { useEffect, useState } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

export default function UserPage() {
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const fetchUsers = async () => {
    const res = await authFetch(API_URL);
    const json = await res.json();
    if (!res.ok || json.statusCode !== 200) {
      console.error(json.message);
      return;
    }
    setUsers(json.data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Guru dan Staff" />
      <div className="space-y-10">
        {!users ? (
          <SkeletonTable
            title="Data Akun Guru dan Staff"
            rowCount={5}
            columns={[
              { label: "Photo", align: "left" },
              { label: "Nama" },
              { label: "Username" },
              { label: "Role" },
            ]}
          />
        ) : (
          <UserTable users={users} onRefresh={fetchUsers} />
        )}
      </div>
    </>
  );
}
