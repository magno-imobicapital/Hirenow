import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { getNavItems, type NavItem } from "./nav-items";
import type { UserInfo } from "./DesktopSidebar";

function DrawerLink({
  item,
  active,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-white"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {item.label}
    </Link>
  );
}

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
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
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
      {initials}
    </div>
  );
}

export default function MobileDrawer({
  open,
  onOpen,
  onClose,
  isActive,
  user,
  onLogout,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  isActive: (href: string) => boolean;
  user: UserInfo | null;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/15 bg-secondary-dark px-4 lg:hidden">
        <button
          type="button"
          onClick={onOpen}
          className="text-white"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <Link href="/dashboard">
          <Image
            src="/images/logo_reduzida.png"
            alt="Hirenow"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
        </Link>
      </div>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-visibility ${
          open ? "visible" : "invisible delay-300"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Panel */}
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-secondary-dark shadow-xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-14 items-center justify-between px-6">
              <Image
                src="/common/logos/logo.png"
                alt="ImobiCapital"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Fechar menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {getNavItems(user?.role).map((item) => (
                <DrawerLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onClose={onClose}
                />
              ))}
            </nav>

            {/* User section */}
            <div className="border-t border-white/15 px-4 py-4">
              {user && (
                <div className="flex items-center gap-3 px-3 mb-3">
                  <UserAvatar name={user.name} image={user.image} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 shrink-0" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
