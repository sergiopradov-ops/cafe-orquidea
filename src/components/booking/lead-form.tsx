"use client";

import Script from "next/script";
import { startTransition, useActionState } from "react";

import {
  submitLeadAction,
  type LeadFormState,
} from "@/app/(public)/_actions/submit-lead";
import type { LeadRequest } from "@/lib/schemas/lead";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      };
    };
  }
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || undefined;

type Props = { type: LeadRequest["type"] };

const inputClass =
  "mt-1 w-full rounded-lg border border-orquidea-100 bg-white px-3 py-2 focus:border-orquidea-500";

export function LeadForm({ type }: Props) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(
    submitLeadAction,
    null,
  );

  async function getToken(): Promise<string> {
    const recaptcha = window.grecaptcha?.enterprise;
    if (!siteKey || !recaptcha) return "";
    return new Promise((resolve) => {
      recaptcha.ready(async () => {
        try {
          resolve(await recaptcha.execute(siteKey, { action: `lead_${type}` }));
        } catch {
          resolve("");
        }
      });
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("recaptchaToken", await getToken());
    startTransition(() => formAction(formData));
  }

  if (state?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-orquidea-50 p-6">
        <h2 className="text-2xl">¡Gracias!</h2>
        <p className="mt-2">
          Recibimos tu solicitud. Te enviamos un correo de confirmación y te
          contactaremos en menos de 24 horas hábiles.
        </p>
      </div>
    );
  }

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  const fieldError = (name: string) => {
    const message = errors[name]?.[0];
    return message ? (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
        {message}
      </p>
    ) : null;
  };
  const aria = (name: string) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `${name}-error` } : {};

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <input type="hidden" name="type" value={type} />
        {/* Honeypot */}
        <div aria-hidden="true" className="hidden">
          <label>
            Sitio web
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Nombre</span>
            <input name="name" required autoComplete="name" className={inputClass} {...aria("name")} />
            {fieldError("name")}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Teléfono / WhatsApp</span>
            <input name="phone" type="tel" required autoComplete="tel" className={inputClass} {...aria("phone")} />
            {fieldError("phone")}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Correo</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} {...aria("email")} />
          {fieldError("email")}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Fecha del evento</span>
            <input name="eventDate" type="date" required className={inputClass} {...aria("eventDate")} />
            {fieldError("eventDate")}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Número de invitados</span>
            <input name="guests" type="number" min={1} required inputMode="numeric" className={inputClass} {...aria("guests")} />
            {fieldError("guests")}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Ubicación del evento</span>
          <input name="location" required placeholder="Colonia, alcaldía o dirección" className={inputClass} {...aria("location")} />
          {fieldError("location")}
        </label>

        <label className="block">
          <span className="text-sm font-medium">Cuéntanos más (opcional)</span>
          <textarea name="notes" rows={4} maxLength={2000} className={inputClass} />
        </label>

        {state && !state.ok ? (
          <p role="alert" className="text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-orquidea-700 px-6 py-3 font-medium text-white hover:bg-orquidea-900 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Enviar solicitud"}
        </button>

        {siteKey ? (
          <p className="text-xs text-cafe/60">
            Protegido por reCAPTCHA. Aplican la{" "}
            <a href="https://policies.google.com/privacy" className="underline">
              Política de privacidad
            </a>{" "}
            y los{" "}
            <a href="https://policies.google.com/terms" className="underline">
              Términos
            </a>{" "}
            de Google.
          </p>
        ) : null}
      </form>
    </>
  );
}
