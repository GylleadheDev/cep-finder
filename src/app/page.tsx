"use client";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "../lib/utils";
import { z } from "zod";

const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/);

export default function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");
  const [cepData, setCepData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Permitir apenas números e um hífen na posição correta
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5, 8);
    setCep(value.slice(0, 9));
    setError("");
  }

  async function handleSearch() {
    try {
      setError("");
      setCepData(null);
      cepSchema.parse(cep);
      setLoading(true);
      const cleanCep = cep.replace(/\D/g, "");
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setError("CEP não encontrado.");
        setCepData(null);
      } else {
        setCepData(data);
      }
    } catch (err: unknown) {
      setError("Digite um CEP válido (ex: 01001-000)");
      setCepData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 rounded bg-primary text-primary-foreground border border-border hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          Alternar para {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <h1 className="text-4xl font-bold">CEP Finder App 🗺️</h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started writing your CEP
            .
          </li>
          <Input
            className="w-full max-w-md my-4"
            placeholder="Write your CEP"
            value={cep}
            onChange={handleInput}
            maxLength={9}
            inputMode="numeric"
            pattern="\d{5}-?\d{3}"
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
          <li className="tracking-[-.01em]">
            After this click in the button below for Search CEP
          </li>
        </ol>
        <div className="flex flex-col gap-4 w-full max-w-md my-4 border-2 bg-neutral-100 dark:bg-neutral-900 border-gray-800 dark:border-gray-300 p-4 rounded-md">
          {loading && <p>Carregando...</p>}
          {cepData && (
            <>
              <h2 className="text-2xl font-bold">CEP: {cepData.cep}</h2>
              <p className="text-sm font-bold ">Rua: {cepData.logradouro}</p>
              <p className="text-sm font-bold ">Bairro: {cepData.bairro}</p>
              <p className="text-sm font-bold ">Cidade: {cepData.localidade}</p>
              <p className="text-sm font-bold ">Estado: {cepData.uf}</p>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button
            className="rounded-full cursor-pointer border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            rel="noopener noreferrer"
            onClick={handleSearch}
            disabled={loading}
          >
            Search CEP 📦
          </Button>
          <Button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            rel="noopener noreferrer"
          >
            Read our docs
          </Button>
        </div>
      </main>
    </div>
  );
}
