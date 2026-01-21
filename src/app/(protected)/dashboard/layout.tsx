import { supabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await supabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");
    return (
        <div>
            {children}
        </div>
    );
}
