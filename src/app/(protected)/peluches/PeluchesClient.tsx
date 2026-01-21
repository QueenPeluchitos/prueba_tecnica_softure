'use client'

import { useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SearchBar } from "./SearchBar"
import { CategoryFilter } from "./CategoryFilter"
import { Trash2, Package } from "lucide-react"
import { EditPelucheDialog } from "./EditPelucheDialog"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Peluche = {
    id: string
    nombre: string
    sku: string
    categoria: string
    precio: number
    stock: number
    stock_minimo: number
    imagen_url?: string | null
}

export function PeluchesClient({
    peluches,
    page,
    pageSize,
    totalPages,
    total,
    onDelete,
    onUpdate,
}: {
    peluches: Peluche[]
    page: number
    pageSize: number
    totalPages: number
    total: number
    onDelete: (id: string) => Promise<unknown>
    onUpdate: (id: string, formData: FormData) => Promise<unknown>
}) {
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const selectedCategory = searchParams.get("categoria") ?? ""

    function goTo(newPage: number) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        params.set("pageSize", String(pageSize))
        router.push(`${pathname}?${params.toString()}`)
    }

    function setCategory(newCategory: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (newCategory) {
            params.set("categoria", newCategory)
        } else {
            params.delete("categoria")
        }
        params.set("page", "1")
        params.set("pageSize", String(pageSize))
        router.push(`${pathname}?${params.toString()}`)
    }

    const filteredPeluches = peluches.filter(peluche =>
        peluche.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <>
            <SearchBar onSearch={setSearchTerm} />
            <CategoryFilter value={selectedCategory} onChange={setCategory} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-10">
            {filteredPeluches.map((peluche) => (
                <Card key={peluche.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-pink-600">{peluche.nombre}</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">SKU: {peluche.sku}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2 bg-pink-200 text-pink-800">{peluche.categoria}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {peluche.imagen_url ? (
                                <img
                                    src={peluche.imagen_url}
                                    alt={peluche.nombre}
                                    className="w-full h-48 object-cover rounded-md border"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center border">
                                    <span className="text-sm text-gray-400">Sin imagen</span>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-pink-600">${peluche.precio.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-pink-500" />
                                    <span className={`font-semibold ${
                                        peluche.stock <= peluche.stock_minimo 
                                            ? 'text-red-600' 
                                            : 'text-green-600'
                                    }`}>
                                        Stock: {peluche.stock}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                                Stock mínimo: {peluche.stock_minimo}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <EditPelucheDialog peluche={peluche} onUpdate={onUpdate} />
                                <button
                                    onClick={async () => {
                                        if (confirm(`¿Estás seguro de que deseas eliminar el peluche "${peluche.nombre}"?`)) {
                                            try {
                                                await onDelete(peluche.id)
                                                alert('Peluche eliminado exitosamente')
                                            } catch (error) {
                                                alert(`Error al eliminar peluche: ${error instanceof Error ? error.message : 'Desconocido'}`)
                                            }
                                        }
                                    }}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-pink-600 hover:text-pink-700 rounded hover:bg-pink-50 transition-colors"
                                    aria-label={`Eliminar peluche ${peluche.nombre}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
            </div>
            <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between text-sm">
                <span>
                    Página {page} de {totalPages} · Mostrando {peluches.length} de {total}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => goTo(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => goTo(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </>
    )
}
