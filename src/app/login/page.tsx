'use client'
import React, { useState } from 'react';
import { signIn } from "@/lib/auth";    
import { useRouter } from 'next/navigation';

function InputField({ label, type, value, onChange, required }: { label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
    return (
        <div className="mb-4">
            <label className="block text-primary text-sm font-bold mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2 border border-primary/30 rounded focus:outline-none focus:border-primary"
            />
        </div>
    );
}

export default function LoginPage() {
const router = useRouter();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
        await signIn(email, password);
        window.location.href = '/dashboard';
    } catch (err: any) {
        setError(err.message || "Ocurrió un error durante el inicio de sesión");
    }
    finally {
        setLoading(false);
    }
}

return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <form onSubmit={handleSubmit} className="bg-card p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl mb-4 text-center text-primary">Iniciar Sesión</h2>
                <div>
                    <InputField
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <InputField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
}