"use client";

import { UpdateDialog } from "@/components/Dialog/UpdateDialog";
import { CustomTable } from "@/components/Tables";
import { EditIcon } from "@/components/Tables/icons";
import { UserPermission } from "@/models/user-permission.model";
import { useEffect, useState } from "react";

type Props = {
  permissions: UserPermission[];
  onRefresh: () => void;
};
export default function PermissionTable({ permissions, onRefresh }: Props) {
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sorted = [...permissions].sort((a, b) =>
    a.userName.localeCompare(b.userName, "id", { sensitivity: "base" })
  );
  const handleEditClick = (uuid: string) => {
    setSelectedUuid(uuid);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUuid(null);
  };

  const handleSuccess = () => {
    onRefresh();
    handleCloseDialog();
  };
  return (
    <>
      <UpdateDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
        formTitle="Edit Status Perizinan"
        formData={[
          {
            name: "status",
            type: "select",
            label: "Status",
            options: [
              { value: "approved", label: "Disetujui" },
              { value: "rejected", label: "Ditolak" },
            ],
            required: true,
          },
        ]}
        endpoint={`/permissions/${selectedUuid}`}
        initialData={sorted.find((perm) => perm.uuid === selectedUuid) || {}}
      />
      <CustomTable<UserPermission>
        title="Data Perizinan"
        data={sorted}
        rowKey="uuid"
        logoAccessor="photoUrl"
        columns={[
          { label: "Nama", accessor: "userName", align: "left" },
          { label: "Alasan", accessor: "reason" },
          { label: "Mulai Izin", accessor: "startDate" },
          { label: "Akhir Izin", accessor: "endDate" },
          { label: "Status", accessor: "status" },
        ]}
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-3.5">
            <button
              onClick={() => handleEditClick(row.uuid)}
              className="hover:text-primary"
            >
              <span className="sr-only">Edit</span>
              <EditIcon />
            </button>
          </div>
        )}
      />
    </>
  );
}
