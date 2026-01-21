"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { ShoppingCart, Eraser } from "lucide-react"

type Producto = {
  id: number
  nombre: string
  precio: number
  [key: string]: any
  imagen_url?: string | null
}

export default function VentasClient({ produtos }: { produtos: Producto[] }) {
  const [carrito, setCarrito] = useState<any[]>([])

  const agregarCarrito = (peluche: Producto) => {
    const existe = carrito.find(p => p.id === peluche.id)
    if (existe) {
        if (existe.cantidad + 1 > peluche.stock) {
            alert(`No hay suficiente stock para el peluche ${peluche.nombre}`)
            return
        }
      setCarrito(carrito.map(p => p.id === peluche.id ? { ...p, cantidad: p.cantidad + 1 } : p))
    } else {
        if (peluche.stock < 1) {
            alert(`No hay suficiente stock para el peluche ${peluche.nombre}`)
            return
        }
      setCarrito([...carrito, { ...peluche, cantidad: 1 }])
    }
  }
    const eliminarProducto = (peluche: Producto) => {
        setCarrito(carrito.filter(item => item.id !== peluche.id));
    }

    const registrarVenta = async (metodo_pago: "Efectivo" | "Tarjeta" | "Tranferencia") => {
        for (const item of carrito) {
            if (item.cantidad > item.stock) {
                alert(`No hay suficiente stock para el peluche ${item.nombre}`)
                return
            }
            const {error: VentaError } = await supabase.from('ventas').insert([{
                producto_id: item.id,
                cantidad: item.cantidad,
                precio: item.precio,
                metodo_pago,
            }])
            if (VentaError) {
                alert(`Error al registrar la venta del peluche ${item.nombre}: ${VentaError.message}`)
                return
            }
            const { error: StockError } = await supabase.from('peluches').update({
                stock: item.stock - item.cantidad,
            }).eq('id', item.id)
            if (StockError) {
                alert(`Error al actualizar el stock del peluche ${item.nombre}: ${StockError.message}`)
                return
            }            
        }
        setCarrito([])
        alert('Venta registrada con éxito')
    }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {produtos?.map((producto) => (
          <div key={producto.id} className="bg-card text-foreground p-4 rounded-lg shadow-md flex flex-col items-center">
            {producto.imagen_url ? (
              <img src={producto.imagen_url} alt={producto.nombre} className="w-32 h-32 object-cover mb-4 rounded-md" />
            ) : (
                <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center mb-4">
                    <span className="text-sm text-muted-foreground">Sin imagen</span>
                </div>
            )}
            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
            <p className="mb-2">Precio: ${producto.precio?.toFixed?.(2) ?? '0.00'}</p>
            <button
              onClick={() => agregarCarrito(producto)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
        
        <div className="bg-card text-foreground p-4 rounded-lg shadow-md max-w-md mx-auto mt-6">
            <h3 className="text-lg font-bold mb-2">Carrito</h3>
            {carrito.length === 0 ? (
          <p className="text-muted-foreground">No hay productos en el carrito.</p>
            ) : (
            <ul className="space-y-2">
                {carrito.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-muted p-2 rounded-md">
                    <span>{item.nombre} x {item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    <button 
                    onClick={() => eliminarProducto(item)}
              className="ml-2 text-primary hover:opacity-80"
                    >
                        <Eraser className="w-4 h-4" />
                    </button>
                </li>
                ))}
            </ul>
            )}

            {carrito.length > 0 && (
                <button
                onClick={() => {
                    const metodo_pago = prompt("Ingrese el método de pago (Efectivo, Tarjeta, Transferencia):", "Efectivo") as "Efectivo" | "Tarjeta" | "Tranferencia"
                    if (metodo_pago === "Efectivo" || metodo_pago === "Tarjeta" || metodo_pago === "Tranferencia") {
                        registrarVenta(metodo_pago)
                    } else {
                        alert("Método de pago inválido")
                    }
                }}
            className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-colors"
            >
                <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Registrar Venta
                </div>
            </button>
            )}
            {carrito.length > 0 && (
            <p className="font-bold mt-2">
                Total: ${carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0).toFixed(2)}
            </p>
            )}
        </div>
    </div>
  )
}
