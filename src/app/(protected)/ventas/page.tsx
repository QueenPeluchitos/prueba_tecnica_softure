"use server"
import { supabaseServer } from "@/lib/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VentasClient from "./VentasClient"
import VentasHistorialClient from "./VentasHistorialClient"

export default async function VentasPage({ searchParams }: { searchParams: Promise<{ fecha_inicio?: string; fecha_fin?: string }> }) {
    const supabase = await supabaseServer();
    const params = await searchParams;

    let query = supabase
        .from('ventas')
        .select('id, fecha_venta, cantidad, total, metodo_pago, producto:producto_id (nombre)')
        .order('fecha_venta', { ascending: false });
    
    if (params.fecha_inicio) {
        query = query.gte('fecha_venta', params.fecha_inicio);
    }
    if (params.fecha_fin) {
        query = query.lte('fecha_venta', params.fecha_fin + 'T23:59:59');
    }

    const { data: ventas, error } = await query;  
    
    const {data: produtos} = await supabase.from('peluches').select('*').order('nombre', { ascending: true });

    if (error) return <p>Error al cargar: {error.message}</p>;

    return (
        <div className="p-6 bg-background text-foreground min-h-screen space-y-6">
            <div>
                <h1 className="text-center text-2xl font-bold mb-6 text-primary">Realizar venta</h1>
                <VentasClient produtos={produtos ?? []} />
            </div>
            <div className="max-w-7xl mx-auto mb-6">
                <h1 className="text-center text-2xl font-bold mb-6 text-primary">Historial de Ventas</h1>
                <VentasHistorialClient ventas={ventas ?? []} />
            </div>
        </div>
    )
}


