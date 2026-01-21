'use client'

import { createPeluche } from "./actions"
import { useState } from "react"

export function PelucheForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage("")
        try {
            await createPeluche(formData)
            setMessage("Peluche agregado exitosamente")
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`)
        }
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="flex flex-col max-w-md mx-auto bg-card p-6 rounded-lg shadow-md space-y-4">
            <input name="nombre" type="text" placeholder="Nombre" required className="w-full p-2 border border-primary/30 rounded" />
            <input name="sku" type="text" placeholder="SKU" required className="w-full p-2 border border-primary/30 rounded" />

            <select name="categoria" required className="w-full p-2 border border-primary/30 rounded">
                <option value="">Selecciona una categoría</option>
                <option value="Animales">Animales</option>
                <option value="Personajes">Personajes</option>
                <option value="Fandoms">Fandoms</option>
                <option value="Otros">Otros</option>
            </select>
            <div className="w-full flex flex-row space-x-1">
                <input name="precio" type="number" step="0.01" placeholder="Precio" required className="w-full p-2 border border-primary/30 rounded" />
                <input name="stock" type="number" placeholder="Stock" required className="w-full p-2 border border-primary/30 rounded" />
                <input name="stock_minimo" type="number" placeholder="Stock mínimo" required className="w-full p-2 border border-primary/30 rounded" />
            </div>
            <input
                name="imagen_url"
                type="url"
                placeholder="URL de la imagen (opcional)"
                className="w-full p-2 border border-primary/30 rounded"
            />
            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="bg-primary text-primary-foreground py-2 px-4 max-w-xs rounded hover:opacity-90 disabled:opacity-50">
                    {loading ? "Guardando..." : "Agregar peluche"}
                </button>
            </div>
            {message && <p className={`text-center font-semibold ${message.includes("✓") ? "text-[#AD1717]" : "text-[#4FDB72]"}`}>{message}</p>}
        </form>
    )
}

export default PelucheForm