"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  const [isFading, setIsFading] = useState(false);

  // once fade starts, wait then navigate
  useEffect(() => {
    if (isFading) {
      const t = setTimeout(() => router.push("/dashboard"), 500);
      return () => clearTimeout(t);
    }
  }, [isFading, router]);

  return (
    <div
      className="relative min-h-screen w-full cursor-pointer"
      onClick={() => setIsFading(true)}
    >
      {/* Your splash image underneath */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/raptor_splash_screen_widescreen.jpg')",
        }}
      />

      {/* Black overlay that fades in */}
      <div
        className={`
          absolute inset-0 bg-black transition-opacity duration-500
          ${isFading ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
