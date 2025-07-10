import Link from "next/link";
import { session } from "@/libs/session";

export const dynamic = "force-dynamic"; // <--- this is required here too

export default async function RightNav() {
  const email = await session().get("email");

  if (email) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="bg-blue-600 text-white py-2 px-2 rounded-full">Dashboard</Link>
        <Link href="/api/logout">Logout</Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/api/auth">Sign in</Link>
      <Link href="/about" className="bg-blue-600 text-white py-2 px-2 rounded-full">Get Started</Link>
    </nav>
  );
}
