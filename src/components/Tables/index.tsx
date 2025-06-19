"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateIndo } from "@/lib/format-date";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ColumnConfig<T> = {
  label: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  align?: "left" | "center" | "right";
  format?: "currency" | "number" | "percent";
};

type CustomTableProps<T> = {
  title?: string;
  data: T[];
  columns: ColumnConfig<T>[];
  logoAccessor?: keyof T;
  rowKey: keyof T | ((row: T, index: number) => string | number);
  renderActions?: (row: T) => React.ReactNode;
  className?: string;
  headerExtras?: React.ReactNode;
};

export function CustomTable<T>({
  title = "Top Items",
  data,
  columns,
  logoAccessor,
  rowKey,
  className,
  renderActions,
  headerExtras,
}: CustomTableProps<T>) {
  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {title}
        </h2>
        {headerExtras && (
          <div className="flex items-center gap-2">{headerExtras}</div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn({
                  "!text-left": col.align === "left" || idx === 0,
                  "!text-right": col.align === "right",
                })}
              >
                {col.label}
              </TableHead>
            ))}
            <TableHead className="!text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={
                typeof rowKey === "function"
                  ? rowKey(row, i)
                  : (row as any)[rowKey]
              }
              className="text-center text-base font-medium text-dark dark:text-white"
            >
              {columns.map((col, idx) => {
                let content: React.ReactNode;
                if (typeof col.accessor === "function") {
                  content = col.accessor(row);
                } else {
                  const raw = row[col.accessor];
                  content = raw as string;

                  if (typeof raw === "string") {
                    if (col.accessor === "role") {
                      if(raw === "teacher") {
                        content = "Guru";
                      } else {
                        content = "Staff";
                      }
                    }

                    if (col.accessor === "status") {
                      if (raw === "approved") {
                        content = "Disetujui";
                      } else if (raw === "rejected") {
                        content = "Ditolak";
                      } else {
                        content = "Menunggu";
                      }
                    }

                    if (col.accessor === "userName") {
                      content = raw
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                    }

                    if (
                      col.accessor === "startDate" ||
                      col.accessor === "endDate"
                    ) {
                      content = formatDateIndo(raw);
                    }
                  }

                  if (typeof raw === "number") {
                    if (col.format === "currency") {
                      content = `$${standardFormat(raw)}`;
                    } else if (col.format === "number") {
                      content = compactFormat(raw);
                    } else if (col.format === "percent") {
                      content = `${raw}%`;
                    }
                  }
                }

                if (idx === 0 && logoAccessor) {
                  const logoUrl =
                    row[logoAccessor] && typeof row[logoAccessor] === "string"
                      ? (row[logoAccessor] as string)
                      : "/images/avatar.jpg";
                  return (
                    <TableCell
                      key={idx}
                      className="flex items-center gap-3 !text-left"
                    >
                      <Image
                        src={logoUrl}
                        alt="logo"
                        className="size-8 rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                      <span>{content}</span>
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={idx}
                    className={cn({
                      "!text-left": col.align === "left",
                      "!text-right": col.align === "right",
                    })}
                  >
                    {content}
                  </TableCell>
                );
              })}
              <TableCell className="!text-right">
                {renderActions?.(row)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
