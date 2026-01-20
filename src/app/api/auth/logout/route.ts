import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  const allCookies = cookieStore.getAll()
  allCookies.forEach(cookie => {
    if (cookie.name.includes('supabase')) {
      cookieStore.delete(cookie.name)
    }
  })
  
  return NextResponse.json({ success: true })
}
