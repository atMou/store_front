"use client";
import BreadCrumb from "@/components/feedback/BreadCrumb";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import { useAuth } from "@/hooks/state/useAuth";
import { User } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <div className="flex h-screen flex-col md:flex-row bg-white overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-black bg-white shrink-0">
          <BreadCrumb />
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-full border border-black bg-gray-50">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                ) : user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName || "User"}
                    fill
                    sizes="36px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-black" />
                )}
              </div>
              {displayName && (
                <span className="text-sm font-medium text-black hidden sm:inline">
                  {displayName}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
