import React from "react";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "../_app";
import Reports from "@/components/dashboard/reports/Reports";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const ReportsPage: NextPageWithLayout = () => {
  return (
    <section>
      <Reports />
    </section>
  );
};

ReportsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ReportsPage;
