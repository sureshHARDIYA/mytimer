import React from "react";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "../../_app";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Project from "@/components/dashboard/projects/project/Project";

const ProjectPage: NextPageWithLayout = () => {
  return (
    <section>
      <Project />
    </section>
  );
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
export default ProjectPage;
