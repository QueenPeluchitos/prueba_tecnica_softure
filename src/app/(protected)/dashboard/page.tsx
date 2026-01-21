"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { AlertCircle, ShoppingCart, Package, TrendingUp } from 'lucide-react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function DashboardPage() {
  const [ventas, setVentas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [palette, setPalette] = useState<string[]>([])

  useEffect(() => {
    loadDashboardData()
    const updatePalette = () => {
      if (typeof window === 'undefined') return
      const style = getComputedStyle(document.documentElement)
      const colors = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']
        .map(token => style.getPropertyValue(token).trim())
        .filter(Boolean)
      setPalette(colors.length ? colors : ['#ec4899'])
    }
    updatePalette()
    const observer = new MutationObserver(() => updatePalette())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: ventasData } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha_venta', { ascending: false })

      const { data: productosData } = await supabase
        .from('peluches')
        .select('*')

      setVentas(ventasData || [])
      setProductos(productosData || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - i)
    return fecha.toISOString().split('T')[0]
  }).reverse()

  const ventasPorDiaSeries = [
    {
      name: 'Cantidad de Ventas',
      data: ultimos7Dias.map(fecha => {
        return ventas.filter(v => v.fecha_venta?.startsWith(fecha)).length
      }),
    },
  ]

  const ventasPorDiaOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { 
      categories: ultimos7Dias.map(f => {
        const date = new Date(f)
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
      })
    },
    colors: [palette[0] || '#ec4899'],
    plotOptions: { bar: { borderRadius: 4 } },
  }

  const categorias: Record<string, number> = {}
  productos.forEach(p => {
    categorias[p.categoria] = (categorias[p.categoria] || 0) + 1
  })

  const productosPorCategoriaSeries = Object.values(categorias)
  const productosPorCategoriaOptions = {
    labels: Object.keys(categorias),
    colors: palette.length ? palette : ['#ec4899', '#f43fa0', '#fb71b1', '#fda4cb', '#fecddf'],
    legend: { position: 'bottom' as const },
  }

  const ingresosSeries = [
    {
      name: 'Ingresos ($)',
      data: ultimos7Dias.map(fecha => {
        return ventas
          .filter(v => v.fecha_venta?.startsWith(fecha))
          .reduce((sum, v) => sum + (v.total || 0), 0)
      }),
    },
  ]

  const ingresosOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: {
      categories: ultimos7Dias.map(f => {
        const date = new Date(f)
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
      })
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: [palette[0] || '#ec4899'],
  }

  const ventasHoy = ventas.filter(v => {
    const hoy = new Date().toISOString().split('T')[0]
    return v.fecha_venta?.startsWith(hoy)
  }).length

  const totalProductos = productos.length

  const productosStockBajo = productos.filter(
    p => p.stock <= p.stock_minimo
  ).length

  const ingresosSemanales = ultimos7Dias.reduce((sum, fecha) => {
    return sum + ventas
      .filter(v => v.fecha_venta?.startsWith(fecha))
      .reduce((s, v) => s + (v.total || 0), 0)
  }, 0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading) {
    return <div className="p-6 text-center text-primary">Cargando...</div>
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{ventasHoy}</div>
              <p className="text-xs text-muted-foreground">Transacciones</p>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalProductos}</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-3 ${productosStockBajo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {productosStockBajo}
              </div>
              {productosStockBajo > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {productos
                    .filter(p => p.stock <= p.stock_minimo)
                    .map(producto => (
                      <div key={producto.id} className="flex justify-between items-center text-sm border-b border-muted pb-1">
                        <span className="text-foreground truncate">{producto.nombre}</span>
                        <span className="text-red-600 font-semibold ml-2">Stock: {producto.stock}</span>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Todo bien</p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Semana</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${ingresosSemanales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Últimos 7 días</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-primary">Ventas por Día (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={ventasPorDiaOptions}
                series={ventasPorDiaSeries}
                type="bar"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-primary">Productos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={productosPorCategoriaOptions}
                series={productosPorCategoriaSeries}
                type="pie"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="rounded-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-primary">Ingresos Últimos 7 Días</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={ingresosOptions}
                series={ingresosSeries}
                type="line"
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}