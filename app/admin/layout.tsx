"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AdminAuthCheck } from "./AdminAuthCheck";
import {
  LayoutDashboard,
  Users,
  GamepadIcon,
  Settings,
  ShieldCheck,
  PlusCircle,
  Puzzle,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminRoutes = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "User Management",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Game Components",
    icon: Puzzle,
    href: "/admin/components",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
  },
  {
    title: "Admin Management",
    icon: ShieldCheck,
    href: "/admin/admins",
  },
  {
    title: "Create Admin",
    icon: PlusCircle,
    href: "/admin/create-admin",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen bg-black text-gray-200">
        <motion.nav
          initial={{ width: isOpen ? 240 : 0 }}
          animate={{ width: isOpen ? 240 : 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed h-screen bg-black border-r border-gray-800 overflow-y-auto scrollbar-hide z-50 ${
            isOpen ? "" : "hidden"
          } md:block`}
        >
          <div className="p-4">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left mb-4 p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-200 md:hidden"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <div className="space-y-1">
              {adminRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.href;

                return (
                  <Link key={route.href} href={route.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {isOpen && <span>{route.title}</span>}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
        <main
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "md:ml-60" : ""
          } p-4 md:p-8`}
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden mb-4 bg-gray-800 hover:bg-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          {children}
        </main>
      </div>
    </AdminAuthCheck>
  );
}
