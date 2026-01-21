'use client'

export function CategoryFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="max-w-4xl mx-auto mt-4 flex items-center gap-3">
      <label className="text-sm">Categoría:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded border-pink-300"
      >
        <option value="">Todas</option>
        <option value="Animales">Animales</option>
        <option value="Personajes">Personajes</option>
        <option value="Fandoms">Fandoms</option>
        <option value="Otros">Otros</option>
      </select>
    </div>
  )
}
