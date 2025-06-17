

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default async function OnboardingPage() {


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Onboarding Placeholder - Edit this page</h1>
    </div>
  );
}
