"use client";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/src/services/api";

interface LoginForm {
  email: string;
  password: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | string;
  accessToken: string;
}
interface LoginResponse {
  accessToken?: string;
  user?: User;
  error?: string;
}

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await api.post<LoginResponse>("/auth/login", {
          email: form.email,
          password: form.password,
        });
        console.log("Resposta do login:", response.data);
        if (response.data.accessToken) {
          login(response.data);
          if (response.data.user?.role === "ADMIN") {
            router.push("/admin");
          }
          if (response.data.user?.role === "USER") {
            router.push("/");
          }
        } else {
          setError("Falha no login. Tente novamente.");
        }
      } catch (err) {
        const error = err as { response?: { data?: { error?: string } } };
        console.error("Erro no login:", err);
        setError(error.response?.data?.error || "E-mail ou senha inválidos!");
      }
    });
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1"
            placeholder="Digite sua senha"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
          <Link
            href="/register"
            className="text-sm text-blue-600 hover:underline"
          >
            Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}
