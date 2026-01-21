import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pink-50 text-pink-500 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Dashboard de Ventas</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}
