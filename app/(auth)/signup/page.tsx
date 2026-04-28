"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const result = await signup({ email, password });
    if ("error" in result) {
      setError(result.error);
      setPending(false);
    } else {
      setConfirmed(true);
    }
  }

  if (confirmed) {
    return (
      <div className="text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
          <svg
            className="h-6 w-6 text-stone-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-stone-900">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          We sent a confirmation link to{" "}
          <span className="font-medium text-stone-700">{email}</span>. Click it
          to activate your account.
        </p>
        <p className="mt-6 text-sm text-stone-400">
          Already confirmed?{" "}
          <Link
            href="/login"
            className="font-medium text-stone-900 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Create an account
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Start your first Porsche analysis free
        </p>
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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-900"
            placeholder="Min. 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-stone-900 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
