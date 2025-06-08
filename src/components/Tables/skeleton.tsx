import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SkeletonTableProps = {
  title?: string;
  columns: {
    label: string;
    align?: "left" | "center" | "right";
  }[];
  rowCount?: number;
  className?: string;
};

export function SkeletonTable({
  title = "Loading...",
  columns,
  rowCount = 5,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <h2 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        {title}
      </h2>

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
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i}>
              {columns.map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
