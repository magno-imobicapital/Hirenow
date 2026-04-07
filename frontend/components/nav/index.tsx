"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";
import MobileDrawer from "./MobileDrawer";
import type { UserInfo } from "./DesktopSidebar";
import { logoutAction } from "@/lib/auth-actions";

export default function AppNav({ user }: { user: UserInfo | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleLogout() {
    await logoutAction();
  }

  return (
    <>
      <DesktopSidebar
        expanded={expanded}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        isActive={isActive}
        user={user}
        onLogout={handleLogout}
      />
      <MobileDrawer
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        isActive={isActive}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
