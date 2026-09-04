"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/app-shell';
import { DataPanel } from '../../components/data-panel';
import { postToApi } from '../../lib/api-client';
import { setSession, type LoginResponse } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await postToApi<LoginResponse>('/auth/login', { email, password });
    if (!result.data) {
      setError(result.error ?? 'No se pudo iniciar sesión.');
      setLoading(false);
      return;
    }

    setSession(result.data);
    router.push('/');
  }

  return (
    <AppShell title="Login" subtitle="Autenticación mediante JWT con la API NestJS.">
      <DataPanel title="Iniciar sesión" subtitle="La sesión se guarda localmente en el navegador y el JWT se envía a la API.">
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            minLength={12}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100"
          />
          {error ? <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm font-medium text-sky-100 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </DataPanel>
    </AppShell>
  );
}
