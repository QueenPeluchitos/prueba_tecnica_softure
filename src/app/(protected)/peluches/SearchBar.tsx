'use client'
import { Search } from "lucide-react"

export function SearchBar({ value, onSearch }: { value?: string; onSearch: (value: string) => void }) {
  return (
    <div className="relative w-full max-w-xs mx-auto mt-6 mb-6">
      <Search 
        className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none" 
        size={16} 
      />
      <input 
        type="text"
        value={value ?? ""}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar..."
        className="w-full p-2 pl-10 text-sm border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}
