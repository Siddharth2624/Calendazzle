import Link from "next/link";
import { CalendarDays } from "lucide-react";
import RightNav from "./RightNav";

export const dynamic = "force-dynamic";

export default function Header() {
  return (
    <header className="flex gap-4 justify-between py-6 text-gray-600">
      <div className="flex items-center gap-10">
        <Link href="/" className="text-blue-600 font-bold text-2xl flex gap-1 items-center">
          <CalendarDays size={24} />
          Calendazzle
        </Link>
        <nav className="flex gap-4">
          <Link href="/features">Features</Link>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
      </div>
      <RightNav />
    </header>
  );
}
