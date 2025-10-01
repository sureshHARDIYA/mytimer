import React from "react";
import type { ReactElement } from "react";

import type { NextPageWithLayout } from "../_app";
import TagBoard from "@/components/dashboard/tags/TagBoard";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const TagsPage: NextPageWithLayout = () => {
  return <TagBoard />;
};

TagsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default TagsPage;
