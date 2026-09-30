"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebsitesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/work?category=PERSONAL");
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center font-mono text-sm space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-coreCyan border-t-transparent animate-spin" />
      <p className="text-zinc-400">Opening Personal Projects Browser Studio...</p>
    </div>
  );
}
