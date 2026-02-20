// @/app/cadastro/page.tsx

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, Phone, Apple } from 'lucide-react'

export default function CadastroPage() {
  const [etapa, setEtapa] = useState(1)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [role, setRole] = useState<'admin' | 'tecnico'>('tecnico')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome.trim()) {
      setErro('Digite seu nome')
      return
    }
    
    if (!email.trim()) {
      setErro('Digite seu email')
      return
    }

    setErro('')
    setEtapa(2)
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    // Validações
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          role,
          telefone
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setErro(error.message)
      setLoading(false)
    } else {
      setSucesso(true)
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirme seu Email</h2>
          <p className="text-gray-600 mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Clique no link do email para ativar sua conta e fazer login.
          </p>
          <a
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition"
          >
            Ir para Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Criar Conta
          </h1>
          <p className="text-gray-500 text-sm">
            {etapa === 1 ? 'Registre-se em segundos' : 'Complete seu cadastro'}
          </p>
        </div>

        {/* ETAPA 1: Nome, Email, Telefone */}
        {etapa === 1 && (
          <form onSubmit={handleContinuar} className="space-y-4">
            {/* Nome */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800"
              />
            </div>

            {/* Telefone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Número de telefone"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800"
              />
            </div>

            {/* Erro */}
            {erro && (
              <div className="text-red-600 text-sm text-center">
                {erro}
              </div>
            )}

            {/* Botão Continuar */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              Continuar
              <span>›</span>
            </button>
          </form>
        )}

        {/* ETAPA 2: Tipo de Conta, Senha, Confirmar Senha */}
        {etapa === 2 && (
          <form onSubmit={handleCadastro} className="space-y-4">
            {/* Tipo de Conta */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'tecnico')}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800 appearance-none cursor-pointer"
              >
                <option value="tecnico">Técnico/Responsável de Time</option>
                <option value="admin">Organizador de Campeonato</option>
              </select>
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirmar Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={mostrarConfirmar ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar senha"
                required
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-800"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarConfirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Erro */}
            {erro && (
              <div className="text-red-600 text-sm text-center">
                {erro}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEtapa(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}

        {/* Divisor (só na etapa 1) */}
        {etapa === 1 && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">OU</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Social */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <Apple className="w-5 h-5" />
                <span className="text-sm font-medium">Apple</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>
          </>
        )}

        {/* Link Login */}
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:underline text-sm font-medium">
            Já tenho conta. Entrar
          </a>
        </div>
      </div>
    </div>
  )
}