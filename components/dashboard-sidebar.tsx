import { Home, User, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoutButton } from "./logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ThemeSwitcher } from "./theme-switcher";



export default function DashboardSidebar() {
  return (
    <aside className="flex flex-col gap-2 w-80 min-h-screen border-r bg-background p-4">
      <div className="flex justify-between items-center mb-8">
        <span className="font-bold text-xl">Dashboard</span>
        <ThemeSwitcher />
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/protected/dashboard">
            <Home className="mr-2 h-5 w-5" /> Home
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/protected/profile">
            <User className="mr-2 h-5 w-5" /> Profile
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/protected/settings">
            <Settings className="mr-2 h-5 w-5" /> Settings
          </Link>
        </Button>
      </nav>
      <Card className="mt-auto p-3">
  <div className="flex flex-row items-center gap-3">
    {/* Random avatar logic */}
    {(() => {
      const avatars = [
        "https://github.com/evilrabbit.png",
        "https://github.com/orta.png",
        "https://github.com/shuding.png",
        "https://github.com/leebyron.png",
        "https://github.com/patrickhulce.png",
        "https://github.com/samuelvasquez.png",
        "https://github.com/alexdotjs.png",
        "https://github.com/shadcn.png",
      ];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      return (
        <Avatar>
          <AvatarImage src={randomAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      );
    })()}
    <div className="flex flex-col min-w-0">
      <span className="font-medium truncate">@username</span>
    </div>
    <LogoutButton />
  </div>
</Card>
    </aside>
  );
}
