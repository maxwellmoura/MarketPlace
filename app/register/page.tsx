"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import api from "@/src/services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cpf: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        cpf: form.cpf,
      });

      setSuccess("Usuário cadastrado com sucesso!");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        cpf: "",
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao cadastrar usuário.");
    }
  };
  function maskCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
      .slice(0, 14);
  }
  function maskPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
      .slice(0, 15);
  }
  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Cadastro</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Digite seu nome"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Digite seu e-mail"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Digite sua senha"
            className="mt-1"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmar Senha
          </label>
          <Input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirme sua senha"
            className="mt-1"
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <Input
            name="phone"
            type="text"
            value={maskPhone(form.phone)}
            onChange={handleChange}
            required
            placeholder="Digite seu telefone"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <Input
            name="cpf"
            type="text"
            value={maskCPF(form.cpf)}
            onChange={handleChange}
            required
            placeholder="Digite seu CPF"
            className="mt-1"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button type="submit" className="w-full sm:w-auto">
            Registrar
          </Button>
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            Já tem conta? Login
          </Link>
        </div>
      </form>
    </div>
  );
}
