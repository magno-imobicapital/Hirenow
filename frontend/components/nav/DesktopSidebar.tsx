import Link from "next/link";
import Image from "next/image";
import { getNavItems, type NavItem } from "./nav-items";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import type { UserRole } from "@/lib/auth-cookie";

export type UserInfo = {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
};

function SidebarLink({
  item,
  active,
  expanded,
}: {
  item: NavItem;
  active: boolean;
  expanded: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <div className="flex w-10 shrink-0 justify-center">
        <item.icon className="h-5 w-5" />
      </div>
      {expanded && <span className="truncate whitespace-nowrap pr-3">{item.label}</span>}
    </Link>
  );
}

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
      {initials}
    </div>
  );
}

export default function DesktopSidebar({
  expanded,
  onMouseEnter,
  onMouseLeave,
  isActive,
  user,
  onLogout,
}: {
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isActive: (href: string) => boolean;
  user: UserInfo | null;
  onLogout: () => void;
}) {
  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
        expanded ? "lg:w-64" : "lg:w-20"
      }`}
    >
      <div className="flex h-full flex-col bg-secondary-dark border-r border-secondary overflow-hidden">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-5">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex w-10 shrink-0 justify-center">
              <Image
                src="/images/logo_reduzida.png"
                alt="Hirenow"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </div>
            {expanded && (
              <span className="ml-1 text-lg font-semibold tracking-tight text-white whitespace-nowrap">
                Hirenow
              </span>
            )}
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-5 py-4 space-y-1">
          {getNavItems(user?.role).map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              expanded={expanded}
            />
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/15 px-5 py-4">
          {user && (
            <div className="flex items-center">
              <div className="flex w-10 shrink-0 justify-center">
                <UserAvatar name={user.name} image={user.image} />
              </div>
              {expanded && (
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-white/60 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className={`flex w-full cursor-pointer items-center rounded-xl py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all ${user ? "mt-3" : ""}`}
          >
            <div className="flex w-10 shrink-0 justify-center">
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            </div>
            {expanded && <span className="whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
