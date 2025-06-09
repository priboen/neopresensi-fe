import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SkeletonTable } from "@/components/Tables/skeleton";
import { Suspense } from "react";

export default function DataAttendancePage() {
  return (
    <>
      <Breadcrumb pageName="Data Kehadiran" />
      <div className="space-y-10">
        <Suspense
          fallback={
            <SkeletonTable
              title="Kehadiran Dewan Guru"
              rowCount={5}
              columns={[
                { label: "Source", align: "left" },
                { label: "Visitors" },
                { label: "Revenues", align: "right" },
                { label: "Sales" },
                { label: "Conversion" },
              ]}
            />
          }
        ></Suspense>
      </div>
    </>
  );
}
