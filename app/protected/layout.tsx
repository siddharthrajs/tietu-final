import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardRightbar from "@/components/dashboard-rightbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col items-center justify-start p-8 gap-6">
        {children}
      </main>
      <DashboardRightbar />
    </div>
  );
}
