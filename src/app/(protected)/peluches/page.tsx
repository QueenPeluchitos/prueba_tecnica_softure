
import { supabaseServer } from "@/lib/server"
import PelucheForm from "./PelucheForm"
import { PeluchesClient } from "./PeluchesClient"
import { deletePeluche, updatePeluche } from "./actions"

export default async function PeluchesPage({
    searchParams,
}: { searchParams: Promise<{ page?: string; pageSize?: string; categoria?: string }> }) {
        const sp = await searchParams
        const page = Math.max(1, Number(sp.page ?? 1))
        const pageSize = Math.max(1, Number(sp.pageSize ?? 4))
        const categoria = sp.categoria
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    

    const supabase = await supabaseServer()
    let query = supabase
        .from("peluches")
        .select("*", { count: "exact" })
        .order("creado_en", { ascending: false })

    if (categoria) {
        query = query.eq("categoria", categoria)
    }

    const { data: peluches, error, count } = await query.range(from, to)

    const total = count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))       

    if (error) return <p>Error al cargar: {error.message}</p>

    return (
        <div className="p-6 bg-pink-50 text-pink-500 min-h-screen">
            <h1 className="text-center text-2xl font-bold mb-6">Inventario</h1>
            <PelucheForm />
            <PeluchesClient
                peluches={peluches || []}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                total={total}
                onDelete={deletePeluche}
                onUpdate={updatePeluche}
            />
        </div>
    )
    
}
