import { redirect } from 'next/navigation'
// Redirige a la página de login
export default function Home() {
  redirect('/login')
}
