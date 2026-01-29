"use client";

import {
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Package,
  PackagePlus,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Inventory", href: "/dashboard/inventory", icon: PackagePlus },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Support", href: "/support", icon: HelpCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-black shrink-0 hidden md:block">
      <div className="flex flex-col h-full">
        {}
        <div className="px-5 py-5 border-b border-black">
          <h1 className="text-xl font-bold text-black">
            <LayoutDashboard className="inline-block w-6 h-6 mr-2" /> Dashboard
          </h1>
        </div>

        {}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border border-transparent
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black hover:border-black"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {}
        <div className="px-4 py-2 border-t border-black">
          <div className="text-xs text-gray-700">
            <p>© 2025 Store Admin</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
