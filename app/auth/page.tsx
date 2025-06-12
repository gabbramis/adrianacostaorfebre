'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function AuthPage () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar que los campos no esten vacios
        if (!username || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Llamar a Supabase
        const supabase = createSupabaseClient()
        const { data, error } = await supabase.auth.signUp({
            email: username,
            password: password,
          })
        
        if (error) {
            alert(error.message);
            return;
        }

        console.log(data);   
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
            <h1 className="text-2xl font-bold mb-4">Registrate</h1>
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit">Registrate</Button>
                </form>
            </Card>
        </div>
    );
}