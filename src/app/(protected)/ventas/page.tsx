"use server"
import { supabaseServer } from "@/lib/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VentasClient from "./VentasClient"

export default async function VentasPage() {
    const supabase = await supabaseServer();

    const { data: ventas, error } = await supabase
        .from('ventas')
        .select('id, fecha_venta, cantidad, total, metodo_pago, producto:producto_id (nombre)')
        .order('fecha_venta', { ascending: false });  
    
    const {data: produtos} = await supabase.from('peluches').select('*').order('nombre', { ascending: true });

    if (error) return <p>Error al cargar: {error.message}</p>;

    return (
        <div className="p-6 bg-pink-50 text-pink-500 min-h-screen space-y-6">
            <div>
                <h1 className="text-center text-2xl font-bold mb-6">Realizar venta</h1>
                <VentasClient produtos={produtos ?? []} />
            </div>
            <div className="mb-6 text-pink-500">
                <h1 className="text-center text-2xl font-bold mb-6">Historial de Ventas</h1>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-pink-500">Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full table-auto border-collapse border border-pink-200">
                            <thead>
                                <tr>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">ID</th>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">Producto</th>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">Cantidad</th>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">Total</th>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">Método de Pago</th>
                                    <th className="border-b border-pink-200 py-2 px-6 text-left text-pink-500">Fecha de Venta</th>
                                </tr>   
                            </thead>
                            <tbody>
                                {ventas?.map((venta) => (
                                    <tr key={venta.id} className="hover:bg-pink-50 transition-colors duration-200">
                                        <td className="border-b border-pink-200 py-2 px-6">{venta.id}</td>
                                        <td className="border-b border-pink-200 py-2 px-6">{Array.isArray(venta.producto) ? venta.producto[0]?.nombre : venta.producto?.nombre}</td>
                                        <td className="border-b border-pink-200 py-2 px-6">{venta.cantidad}</td>
                                        <td className="border-b border-pink-200 py-2 px-6">${venta.total?.toFixed?.(2) ?? '0.00'}</td>
                                        <td className="border-b border-pink-200 py-2 px-6">{venta.metodo_pago}</td>
                                        <td className="border-b border-pink-200 py-2 px-6">{venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleDateString() : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


