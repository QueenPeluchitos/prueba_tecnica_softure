import { supabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';

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
            <Navbar />
            {children}
        </div>
    );
}
