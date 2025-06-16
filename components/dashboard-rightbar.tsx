import { Card } from "@/components/ui/card";

export default function DashboardRightbar() {
  return (
    <aside className="flex flex-col gap-4 w-80 min-h-screen border-l bg-background p-4">
      <Card className="p-4 mb-4">
        <div className="font-semibold">What&apos;s happening</div>
        <div className="text-muted-foreground text-sm mt-2">Trending topics, news, or widgets can go here.</div>
      </Card>
      <Card className="p-4">
        <div className="font-semibold">Suggestions</div>
        <div className="text-muted-foreground text-sm mt-2">User suggestions, ads, or extra info.</div>
      </Card>
    </aside>
  );
}
