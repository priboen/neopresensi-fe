// components/Tables/TableActions.tsx
"use client";

import { TrashIcon } from "@/assets/icons";
import { DownloadIcon, EditIcon, PreviewIcon } from "./icons";

type TableActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
};

export function TableActions({
  onView,
  onEdit,
  onDelete,
  onDownload,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-end gap-x-3.5">
      {onView && (
        <button onClick={onView} className="hover:text-primary">
          <span className="sr-only">View</span>
          <PreviewIcon />
        </button>
      )}

      {onEdit && (
        <button onClick={onEdit} className="hover:text-primary">
          <span className="sr-only">Edit</span>
          <EditIcon />
        </button>
      )}

      {onDelete && (
        <button onClick={onDelete} className="hover:text-primary">
          <span className="sr-only">Delete</span>
          <TrashIcon />
        </button>
      )}

      {onDownload && (
        <button onClick={onDownload} className="hover:text-primary">
          <span className="sr-only">Download</span>
          <DownloadIcon />
        </button>
      )}
    </div>
  );
}
