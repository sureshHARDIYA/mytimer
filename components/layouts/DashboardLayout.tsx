import axios from "axios";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { Footer } from "./Footer";
import styles from "./Layout.module.scss";
import {
  useTimerContext,
  useProjectTimerContext,
} from "@/hooks/use-store-hooks";
import { formatDuration } from "@/lib/utils/date";

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  const { timer, documentTitle } = useTimerContext();
  const { activeTimer } = useProjectTimerContext();
  const [projectTimerTitle, setProjectTimerTitle] = useState("");

  // Update project timer title every second
  useEffect(() => {
    if (!activeTimer) {
      setProjectTimerTitle("");
      return;
    }

    const updateTitle = () => {
      const start = new Date(activeTimer.startTime);
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - start.getTime()) / 1000
      );
      const formattedTime = formatDuration(diffInSeconds);
      setProjectTimerTitle(
        `${formattedTime} • ${activeTimer.projectTitle} • Time Bank`
      );
    };

    updateTitle();
    const interval = setInterval(updateTitle, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Determine which title to show: project timer, home timer, or default
  const pageTitle = projectTimerTitle || (timer ? documentTitle : "Time Bank");

  return (
    <div className={styles.main}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header isSticky={true} />
      <div className={styles.container}>
        <aside>
          <Sidebar />
        </aside>
        <SWRConfig
          value={{
            fetcher: (url: string) => axios.get(url).then((res) => res.data),
          }}
        >
          <main>{children}</main>
        </SWRConfig>
        <Toaster richColors />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
