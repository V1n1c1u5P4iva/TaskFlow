"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.replace("/dashboard"); // usuário logado → dashboard
    } else {
      router.replace("/login"); // não logado → login
    }
  }, [router]);

  return null; // nada é renderizado enquanto redireciona
}
