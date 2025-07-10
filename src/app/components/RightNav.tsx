'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RightNav({ email }: { email: string }) {
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLoggedOut(window.location.href.includes("logged-out=1"));
    }
  }, []);

  if (email && !hasLoggedOut) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="bg-blue-600 text-white py-2 px-2 rounded-full">
          Dashboard
        </Link>
        <Link href="/api/logout">Logout</Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link href="/api/auth">Sign in</Link>
      <Link href="/about" className="bg-blue-600 text-white py-2 px-2 rounded-full">
        Get Started
      </Link>
    </nav>
  );
}
