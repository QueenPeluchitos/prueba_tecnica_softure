'use client'

import { useEffect, useState } from "react"
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
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const selectedCategory = searchParams.get("categoria") ?? ""
    const searchTerm = searchParams.get("search") ?? ""
    const [searchInput, setSearchInput] = useState(searchTerm)

    useEffect(() => {
        setSearchInput(searchTerm)
    }, [searchTerm])

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
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    function setSearch(newSearch: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (newSearch) {
            params.set("search", newSearch)
        } else {
            params.delete("search")
        }
        params.set("page", "1")
        params.set("pageSize", String(pageSize))
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchInput !== searchTerm) {
                setSearch(searchInput)
            }
        }, 350)

        return () => clearTimeout(handler)
    }, [searchInput, searchTerm])

    return (
        <>
            <SearchBar value={searchInput} onSearch={setSearchInput} />
            <CategoryFilter value={selectedCategory} onChange={setCategory} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-10">
            {peluches.map((peluche) => (
                <Card key={peluche.id} className="bg-card text-foreground hover:shadow-lg transition-shadow rounded-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-primary">{peluche.nombre}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">SKU: {peluche.sku}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2">{peluche.categoria}</Badge>
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
                                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center border">
                                    <span className="text-sm text-muted-foreground">Sin imagen</span>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-primary">${peluche.precio.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    <span className={`font-semibold ${
                                        peluche.stock <= peluche.stock_minimo 
                                            ? 'text-red-600' 
                                            : 'text-green-600'
                                    }`}>
                                        Stock: {peluche.stock}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
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
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-primary hover:opacity-80 rounded hover:bg-muted transition-colors"
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
            <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between text-sm text-foreground">
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
