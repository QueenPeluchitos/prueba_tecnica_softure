'use client'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut()         
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

}