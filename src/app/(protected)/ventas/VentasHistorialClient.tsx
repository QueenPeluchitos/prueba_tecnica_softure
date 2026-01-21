"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

type Venta = {
  id: number
  fecha_venta: string
  cantidad: number
  total: number
  metodo_pago: string
  producto: { nombre: string } | { nombre: string }[] | null
}

export default function VentasHistorialClient({ ventas }: { ventas: Venta[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fechaInicio, setFechaInicio] = useState(searchParams.get('fecha_inicio') || '')
  const [fechaFin, setFechaFin] = useState(searchParams.get('fecha_fin') || '')

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (fechaInicio) params.set('fecha_inicio', fechaInicio)
    if (fechaFin) params.set('fecha_fin', fechaFin)
    router.push(`/ventas?${params.toString()}`)
  }
  const handleReset = () => {
    setFechaInicio('')
    setFechaFin('')
    router.push('/ventas')
  }

  const getProductoNombre = (producto: Venta['producto']) => {
    if (!producto) return 'N/A'
    if (Array.isArray(producto)) return producto[0]?.nombre || 'N/A'
    return producto.nombre || 'N/A'
  }

  return (
    <Card className="bg-card text-foreground rounded-lg">
      <CardHeader>
        <CardTitle className="text-primary">Ventas Recientes</CardTitle>
        <div className="flex gap-4 mt-4 flex-wrap items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground/70 flex items-center gap-2">
              <Calendar className="w-4 h-4 " />
              Fecha inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground/70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-colors"
          >
            Filtrar
          </button>
          <button
            onClick={handleReset}
            className="bg-muted text-foreground px-4 py-2 rounded-md hover:opacity-90 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border-b py-2 px-6 text-left text-primary">Producto</th>
              <th className="border-b py-2 px-6 text-left text-primary">Cantidad</th>
              <th className="border-b py-2 px-6 text-left text-primary">Total</th>
              <th className="border-b py-2 px-6 text-left text-primary">Método de Pago</th>
              <th className="border-b py-2 px-6 text-left text-primary">Fecha de Venta</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No hay ventas para mostrar
                </td>
              </tr>
            ) : (
              ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-muted transition-colors duration-200">
                  <td className="border-b py-2 px-6">{getProductoNombre(venta.producto)}</td>
                  <td className="border-b py-2 px-6">{venta.cantidad}</td>
                  <td className="border-b py-2 px-6">${venta.total?.toFixed?.(2) ?? '0.00'}</td>
                  <td className="border-b py-2 px-6">{venta.metodo_pago}</td>
                  <td className="border-b py-2 px-6">
                    {venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
