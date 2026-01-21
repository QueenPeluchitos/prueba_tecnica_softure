'use client'

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pen } from "lucide-react"

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

type Props = {
    peluche: Peluche
    onUpdate: (id: string, formData: FormData) => Promise<unknown>
}

export function EditPelucheDialog({ peluche, onUpdate }: Props) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [form, setForm] = useState({
        nombre: peluche.nombre,
        sku: peluche.sku,
        categoria: peluche.categoria,
        precio: peluche.precio,
        stock: peluche.stock,
        stock_minimo: peluche.stock_minimo,
        imagen_url: peluche.imagen_url ?? "",
    })

    const handleSubmit = () => {
        const fd = new FormData()
        fd.append('nombre', form.nombre)
        fd.append('sku', form.sku)
        fd.append('categoria', form.categoria)
        fd.append('precio', form.precio.toString())
        fd.append('stock', form.stock.toString())
        fd.append('stock_minimo', form.stock_minimo.toString())
        fd.append('imagen_url', form.imagen_url ?? "")

        startTransition(async () => {
            await onUpdate(peluche.id, fd)
            setOpen(false)
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger  asChild>
                <button className="text-primary px-2 py-1 rounded hover:bg-primary/10"><Pen className="w-4 h-4 mr-1" /></button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-card p-6 rounded-lg shadow-md text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-primary mb-4">Editar Peluche</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col space-y-4">
                    <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="Nombre"
                    />
                    <input
                        type="text"
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="SKU"
                    />
                    <select
                        value={form.categoria}
                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        className="w-full p-2 border border-primary/30 rounded"
                    >
                        <option value="Animales">Animales</option>
                        <option value="Personajes">Personajes</option>
                        <option value="Fandoms">Fandoms</option>
                        <option value="Otros">Otros</option>
                    </select>
                    <input
                        type="number"
                        step="0.01"
                        value={form.precio}
                        onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="Precio"
                    />
                    <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="Stock"
                    />
                    <input
                        type="number"
                        value={form.stock_minimo}
                        onChange={(e) => setForm({ ...form, stock_minimo: parseInt(e.target.value) })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="Stock mínimo"
                    />
                    <input
                        type="url"
                        value={form.imagen_url}
                        onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                        className="w-full p-2 border border-primary/30 rounded"
                        placeholder="URL de la imagen (opcional)"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-muted text-foreground rounded hover:opacity-90"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
                        >
                            {isPending ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}