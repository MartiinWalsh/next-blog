"use client";

import Navbar from "../components/Navbar";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </UserContext.Provider>
  );
}
