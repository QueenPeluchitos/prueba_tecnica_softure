'use server'

import { supabaseServer } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function createPeluche(formData: FormData) {
    const supabase = await supabaseServer()
    
    const imagenRaw = formData.get('imagen_url') as string | null
    const imagen_url = imagenRaw && imagenRaw.trim() ? imagenRaw.trim() : null

    const peluche = {
        nombre: formData.get('nombre') as string,
        sku: formData.get('sku') as string,
        categoria: formData.get('categoria') as string,
        precio: parseFloat(formData.get('precio') as string),
        stock: parseInt(formData.get('stock') as string),
        stock_minimo: parseInt(formData.get('stock_minimo') as string),
        imagen_url,
    }

    const { data, error } = await supabase
        .from('peluches')
        .insert([peluche])
        .select()

    if (error) {
        console.error('Error al crear peluche:', error)
        throw new Error(error.message)
    }

    console.log('Peluche creado:', data)
    revalidatePath('/(protected)/peluches')
    return data
}

export async function deletePeluche(id: string) {
    const supabase = await supabaseServer()
    const { data, error } = await supabase
        .from('peluches')
        .delete()
        .eq('id', id)
    if (error) {
        console.error('Error al eliminar peluche:', error)
        throw new Error(error.message)
    }
    console.log('Peluche eliminado:', data)
    revalidatePath('/(protected)/peluches')
    return data
}

export async function updatePeluche(id: string, formData: FormData) {
    const supabase = await supabaseServer()

    const imagenRaw = formData.get('imagen_url') as string | null
    const imagen_url = imagenRaw && imagenRaw.trim() ? imagenRaw.trim() : null

    const peluche = {
        nombre: formData.get('nombre') as string,
        sku: formData.get('sku') as string,
        categoria: formData.get('categoria') as string,
        precio: parseFloat(formData.get('precio') as string),
        stock: parseInt(formData.get('stock') as string),
        stock_minimo: parseInt(formData.get('stock_minimo') as string),
        imagen_url,
    }
    const { data, error } = await supabase
        .from('peluches')
        .update(peluche)
        .eq('id', id)
    if (error) {
        console.error('Error al actualizar peluche:', error)
        throw new Error(error.message)
    }
    console.log('Peluche actualizado:', data)
    revalidatePath('/(protected)/peluches')
    return data
}   