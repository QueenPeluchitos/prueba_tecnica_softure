"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"

type Producto = {
  id: number
  nombre: string
  precio: number
  [key: string]: any
}

export default function VentasClient({ produtos }: { produtos: Producto[] }) {
  const [carrito, setCarrito] = useState<any[]>([])

  const agregarCarrito = (peluche: Producto) => {
    const existe = carrito.find(p => p.id === peluche.id)
    if (existe) {
      setCarrito(carrito.map(p => p.id === peluche.id ? { ...p, cantidad: p.cantidad + 1 } : p))
    } else {
      setCarrito([...carrito, { ...peluche, cantidad: 1 }])
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {produtos?.map((producto) => (
          <div key={producto.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">{producto.nombre}</h2>
            <p className="mb-2">Precio: ${producto.precio?.toFixed?.(2) ?? '0.00'}</p>
            <button
              onClick={() => agregarCarrito(producto)}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Carrito</h3>
        {carrito.length === 0 ? (
          <p className="text-sm text-gray-500">No hay items en el carrito.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {carrito.map(item => (
              <li key={item.id} className="flex justify-between bg-white p-2 rounded shadow-sm">
                <span>{item.nombre} x {item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
