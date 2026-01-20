'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"

export default function Navbar() {
    const router = useRouter()
    const path = usePathname()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="bg-pink-50 shadow-md">
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
              href="/productos"
              className={`text-pink-500 hover:text-pink-700 font-medium${path === "/productos" ? " underline" : ""}`}
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
            className="bg-pink-300 text-white py-2 px-4 rounded hover:bg-pink-400"
          >
            Cerrar sesión
          </button>

        </div>
      </div>
    </nav>
  )
}
