"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Telescope, Settings, Menu, FerrisWheel } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/tooltip";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/environments", icon: Telescope, label: "Environments" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 w-16 flex flex-col border-r border-border bg-black">
        <nav className="flex flex-1 flex-col items-center gap-4 py-4">
          <FerrisWheel size={32} />
          {navItems.map(({ href, icon: Icon, label }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors
                    ${
                      pathname === href
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mb-4 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
                <Menu className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Menu</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
