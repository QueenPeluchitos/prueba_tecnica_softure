'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { LogOut } from "lucide-react"

export default function Navbar() {
    const router = useRouter()
    const path = usePathname()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="bg-pink-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className={`text-pink-500 hover:text-pink-700 font-medium${path === "/dashboard" ? " underline" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/peluches"
              className={`text-pink-500 hover:text-pink-700 font-medium${path === "/peluches" ? " underline" : ""}`}
            >
              Productos
            </Link>
            <Link
              href="/ventas"
              className={`text-pink-500 hover:text-pink-700 font-medium${path === "/ventas" ? " underline" : ""}`}
            >
              Ventas
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-pink-300 text-white py-2 px-2 rounded hover:bg-pink-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </button>

        </div>
      </div>
    </nav>
  )
}
