import type { ReactNode } from "react"
import Link from "next/link"
import { AdminAuthCheck } from "./AdminAuthCheck"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthCheck>
      <div className="flex h-screen bg-black text-white ">
        <nav className="w-64 bg-black p-6 border-r border-gray-400">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="hover:text-blue-400">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="hover:text-blue-400">
                Manage Users
              </Link>
            </li>
            <li>
              <Link href="/admin/admins" className="hover:text-blue-400">
                Manage Admins
              </Link>
            </li>
            <li>
              <Link href="/admin/components" className="hover:text-blue-400">
                Game Components
              </Link>
            </li>
            <li>
              <Link href="/admin/create-admin" className="hover:text-blue-400">
                Create Admin
              </Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </AdminAuthCheck>
  )
}

