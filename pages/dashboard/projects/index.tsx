import React from "react";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "../../_app";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProjectBoard from "@/components/dashboard/projects/ProjectBoard";

const ProjectsPage: NextPageWithLayout = () => {
  return (
    <section>
      <ProjectBoard />
    </section>
  );
};

ProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProjectsPage;
