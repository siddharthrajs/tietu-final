import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch the user's profile from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("has_onboarded")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    // Handle error or fallback (optional: show an error page)
  }

  if (!profile || !profile.has_onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <div className="bg-accent/30 p-4 rounded-md">
        <p className="text-lg">Hello, {data.user.user_metadata?.username || data.user.email} 👋</p>
        <p className="mt-2 text-muted-foreground">This dashboard is protected and only visible to authenticated users.</p>
      </div>
      {/* Add more dashboard widgets, stats, or user info here */}
    </div>
  );
}