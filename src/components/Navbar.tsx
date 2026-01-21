'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { LogOut, Sparkles } from "lucide-react"
import { useTheme } from "@/context/Temas"

export default function Navbar() {
    const router = useRouter()
    const path = usePathname()
  const { toggleTheme } = useTheme()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="bg-card shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className={`text-primary hover:opacity-80 font-medium${path === "/dashboard" ? " underline" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              href="/peluches"
              className={`text-primary hover:opacity-80 font-medium${path === "/peluches" ? " underline" : ""}`}
            >
              Productos
            </Link>
            <Link
              href="/ventas"
              className={`text-primary hover:opacity-80 font-medium${path === "/ventas" ? " underline" : ""}`}
            >
              Ventas
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:opacity-80 text-primary"
              aria-label="Cambiar tema"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center bg-primary text-primary-foreground py-2 px-2 rounded hover:opacity-90"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
