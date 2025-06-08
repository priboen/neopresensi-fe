"use client";
import { CustomTable } from ".";
import { AppUser } from "@/models/app-user.model";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditIcon, PreviewIcon } from "./icons";
import { TrashIcon } from "@/assets/icons";

type Props = {
  users: AppUser[];
};

export default function UserTable({ users }: Props) {
  const router = useRouter();

  const handleDelete = (uuid: string) => {
    console.log("🗑 Delete user with UUID:", uuid);
  };

  return (
    <CustomTable<AppUser>
      title="Data Pengguna"
      data={users}
      rowKey={(user) => user.uuid}
      logoAccessor="photo_url"
      columns={[
        { label: "Nama", accessor: "name", align: "left" },
        { label: "Username", accessor: "username" },
        { label: "Role", accessor: "role" },
      ]}
      renderActions={(user) => (
        <div className="flex items-center justify-end gap-3.5">
          <Link href={`/user/${user.uuid}`} className="hover:text-primary">
            <span className="sr-only">Detail</span>
            <PreviewIcon className="h-5 w-5" />
          </Link>
          <Link href={`/user/edit/${user.uuid}`} className="hover:text-primary">
            <span className="sr-only">Edit</span>
            <EditIcon className="h-5 w-5 " />
          </Link>
          <button
            onClick={() => handleDelete(user.uuid)}
            className="hover:text-primary"
          >
            <span className="sr-only">Delete</span>
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    />
  );
}
