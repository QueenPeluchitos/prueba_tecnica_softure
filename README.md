# Prueba Técnica - Sistema POS SOFTURE

Sistema de punto de venta (POS) desarrollado con **Next.js 16.1.3**, **TypeScript**, **Supabase** y **Tailwind CSS v4**.

## Características Implementadas

### Autenticación
- Login seguro con Supabase Auth
- Rutas protegidas con validación de sesión
- Redirect automático a login para usuarios no autenticados

### Dashboard
- Estadísticas en tiempo real (ventas hoy, total productos, stock bajo, ingresos semanales)
- Gráficos interactivos con ApexCharts
- Colores dinámicos según tema activo

### Gestión de Productos
- Listado con paginación
- SearchBar
- Filtrado por categoría
- CRUD completo (crear, editar, eliminar)

### Registro de Ventas
- Inserción con precio y cantidad
- Total calculado automáticamente
- Filtrado por rango de fechas
- Historial con detalles

### Sistema de Temas
- Tema Claro: Paleta rosa (#ec4899)
- Tema Oscuro: Paleta morada (#a855f7)
- Toggle en Navbar
- Persistencia en localStorage

## Despliegue

**App en vivo**: [https://prueba-tecnica-softure.vercel.app](https://prueba-tecnica-softure-l34ih2g8d-dianas-projects-49e61575.vercel.app)

## Stack Técnico

- Next.js 16.1.3 con Turbopack
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS v4 + CSS Variables
- ApexCharts
- shadcn/ui

## Instalación

\`\`\`bash
npm install
npm run dev
\`\`\`

## Requisitos Cumplidos

- Autenticación funcional
- CRUD de productos completo
- Registro de ventas
- Dashboard con gráficas
- Deployment en Vercel
- Búsqueda
- Filtrado por fechas

## Requisitos extras
- Sistema de temas
- Responsive design
- Loading states
