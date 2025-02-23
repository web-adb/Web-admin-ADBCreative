import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";

import React from "react";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="List Anggota" />
      <div className="space-y-6">
        <ComponentCard title="List Anggota">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
