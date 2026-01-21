'use server'
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Navbar from "@/components/Navbar"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookies: any[]) {
                    cookies.forEach(({ name, value, options }) => {
                        try {
                            cookieStore.set(name, value, options)
                        } catch (error) {
                        }
                    })
                }
            }
        }
    )
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
        redirect("/login")
    }
    return <>
    <Navbar />
    {children}</>
}