"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import MagneticButton from "@/components/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;
type Status = "idle" | "loading" | "success";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const root = useRef<HTMLElement | null>(null);

  function validate(): boolean {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Subject is required.";
    if (!values.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function update(name: keyof typeof values, val: string) {
    setValues((v) => ({ ...v, [name]: val }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setValues({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 4500);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      gsap.from("[data-closing-word]", {
        yPercent: 120,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-closing]", start: "top 70%", once: true },
      });
      gsap.from("[data-form-beat] > *", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-form-beat]", start: "top 80%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const closingWords = ["Let's", "report", "the", "truth,", "together."];

  return (
    <section id="contact" ref={root} className="grain-overlay relative overflow-hidden bg-ink-950">
      {/* BEAT 1 — full-bleed dramatic closing statement */}
      <div data-closing className="relative flex min-h-[70svh] items-center px-6 py-24 md:px-10">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-[-4vh] left-1/2 -translate-x-1/2 select-none font-display text-[24vw] font-black leading-none text-press/[0.06] md:text-[18vw]"
        >
          CONTACT
        </span>
        <div className="relative z-10 mx-auto w-full max-w-editorial">
          <span className="eyebrow text-press">07 / Contact</span>
          <h2 className="display-tight mt-6 font-display text-[12vw] font-bold text-paper-50 md:text-[8vw] lg:text-[7rem]">
            {closingWords.map((w, i) => (
              <span key={i} className="mask-line mr-[0.25em] inline-block">
                <span
                  data-closing-word
                  className={`mask-inner inline-block ${w === "truth," ? "italic text-press" : ""}`}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* BEAT 2 — form + channels */}
      <div className="relative border-t border-paper-50/10 bg-ink-900">
        <div className="mx-auto grid max-w-editorial grid-cols-12 gap-x-4 gap-y-12 px-6 py-16 md:px-10 md:py-28">
          {/* left: invitation + socials */}
          <div className="col-span-12 md:col-span-5">
            <p className="max-w-sm text-base leading-[1.7] text-paper-50/70">
              For interviews, editorial collaborations, or sensitive tips, reach out using the form
              or the channels below. All correspondence is treated with journalistic discretion.
            </p>
            <div className="mt-10 space-y-5">
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-sm text-paper-50/80 transition-colors hover:text-press"
              >
                <span className="h-px w-8 bg-paper-50/40 transition-all duration-300 group-hover:w-12 group-hover:bg-press" />
                {site.email}
              </a>
              <div className="flex flex-wrap gap-3 pt-3">
                <MagneticButton
                  href={site.socials.facebook}
                  className="border border-paper-50/20 px-5 py-3 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:border-press hover:bg-press"
                >
                  Facebook
                </MagneticButton>
                <MagneticButton
                  href={site.socials.twitter}
                  className="border border-paper-50/20 px-5 py-3 text-[0.66rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors hover:border-press hover:bg-press"
                >
                  X / Twitter
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* right: form */}
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <form
              data-form-beat
              onSubmit={onSubmit}
              noValidate
              className="space-y-5"
            >
              <Field
                label="Name"
                name="name"
                type="text"
                value={values.name}
                error={errors.name}
                onChange={(v) => update("name", v)}
                disabled={status === "loading"}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={(v) => update("email", v)}
                disabled={status === "loading"}
              />
              <Field
                label="Subject"
                name="subject"
                type="text"
                value={values.subject}
                error={errors.subject}
                onChange={(v) => update("subject", v)}
                disabled={status === "loading"}
              />
              <TextArea
                label="Message"
                name="message"
                value={values.message}
                error={errors.message}
                onChange={(v) => update("message", v)}
                disabled={status === "loading"}
              />

              <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                <StatusLine status={status} />
                <SubmitButton status={status} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ status }: { status: Status }) {
  const loading = status === "loading";
  return (
    <MagneticButton
      as="button"
      type="submit"
      onClick={() => {}}
      disabled={loading}
      className={`group inline-flex items-center gap-3 px-6 py-3.5 text-[0.7rem] uppercase tracking-eyebrow-2 text-paper-50 transition-colors ${
        loading
          ? "bg-press/60"
          : "bg-press hover:bg-press-600"
      }`}
    >
      <span className="relative">
        {loading ? "Sending…" : "Send inquiry"}
        {loading && (
          <span className="absolute -right-5 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin rounded-full border border-paper-50/40 border-t-paper-50" />
        )}
      </span>
      {!loading && (
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
      )}
    </MagneticButton>
  );
}

function StatusLine({ status }: { status: Status }) {
  return (
    <span
      className={`text-[0.66rem] uppercase tracking-eyebrow-2 transition-opacity duration-300 ${
        status === "success" ? "text-press opacity-100" : "opacity-0"
      }`}
    >
      ✓ Message queued — no backend yet
    </span>
  );
}

function Field({
  label,
  name,
  type,
  value,
  error,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2.5 block text-paper-50/55">
        {label}
      </label>
      <div
        className={`field-shell relative border bg-ink-950 px-4 py-3 ${
          error ? "border-press/70" : "border-paper-50/20"
        }`}
      >
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className="field-input w-full bg-transparent text-sm text-paper-50 placeholder-paper-50/30 outline-none disabled:opacity-50"
          placeholder={label}
        />
      </div>
      {error && (
        <p id={errId} className="mt-2 text-[0.62rem] uppercase tracking-eyebrow-2 text-press">
          {error}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  error,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const errId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2.5 block text-paper-50/55">
        {label}
      </label>
      <div
        className={`field-shell relative border bg-ink-950 px-4 py-3 ${
          error ? "border-press/70" : "border-paper-50/20"
        }`}
      >
        <textarea
          id={name}
          name={name}
          value={value}
          rows={5}
          required
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className="field-input w-full resize-none bg-transparent text-sm text-paper-50 placeholder-paper-50/30 outline-none disabled:opacity-50"
          placeholder="Briefly describe your inquiry or tip…"
        />
      </div>
      {error && (
        <p id={errId} className="mt-2 text-[0.62rem] uppercase tracking-eyebrow-2 text-press">
          {error}
        </p>
      )}
    </div>
  );
}
