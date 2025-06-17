
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardRightbar from "@/components/dashboard-rightbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_onboarded")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.has_onboarded) {
    redirect("/onboarding");
  }

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
