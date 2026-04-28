"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const result = await login({ email, password });
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
    // On success, login() redirects to /dashboard — this code never runs
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-stone-500">Welcome back</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-900"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-stone-900 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
