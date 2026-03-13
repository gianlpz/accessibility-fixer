import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find & fix accessibility
            <br />
            <span className="text-primary">violations instantly</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Paste your HTML, get a full WCAG audit powered by axe-core, then let
            AI explain each violation in plain language and generate corrected
            code — complete with before/after diffs.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/audit"
              className="rounded-lg bg-primary px-8 py-3 text-base font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Start Audit
            </Link>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-8 py-3 text-base font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              WCAG Reference
            </a>
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          <StepCard
            step="1"
            title="Paste HTML"
            description="Drop in a full page or fragment — any HTML you want to audit for accessibility."
          />
          <StepCard
            step="2"
            title="Get Violations"
            description="axe-core scans your markup and surfaces every WCAG violation with severity levels."
          />
          <StepCard
            step="3"
            title="AI Fixes + Diffs"
            description="Gemini explains each issue in plain language and generates corrected code with visual diffs."
          />
        </div>
      </main>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {step}
      </div>
      <h3 className="mb-2 text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
