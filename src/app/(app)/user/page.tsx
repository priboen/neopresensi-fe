import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import UserTable from "@/components/Tables/UserTable";
import { AppUser } from "@/models/app-user.model";
import { cookies } from "next/headers";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

export default async function UserPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(
    process.env.NEXT_PUBLIC_AUTH_TOKEN_COOKIE_NAME ?? "authToken"
  )?.value;

  const res = await fetch(API_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || json.statusCode !== 200) {
    throw new Error(json.message || "Gagal mengambil data pengguna");
  }

  const users: AppUser[] = json.data;

  return (
    <>
      <Breadcrumb pageName="Pengguna" />
      <div className="space-y-10">
        {users.length === 0 ? (
          <SkeletonTable
            title="Data Pengguna"
            rowCount={5}
            columns={[
              { label: "Photo", align: "left" },
              { label: "Nama" },
              { label: "Username" },
              { label: "Role" },
            ]}
          />
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </>
  );
}
