import { redirect } from "next/navigation";
import AppNav from "@/components/nav";
import { decodeAuthToken, getAuthCookie } from "@/lib/auth-cookie";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthCookie();
  if (!token) redirect("/login");

  const payload = decodeAuthToken(token);
  const user = {
    name: payload.email,
    email: payload.email,
    role: payload.role,
  };

  return (
    <div className="min-h-screen">
      <AppNav user={user} />
      <main className="lg:pl-20">{children}</main>
    </div>
  );
}
