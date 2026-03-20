"use client";

import { InputMode } from "../lib/types";

interface InputModeTabsProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
}

const modes: { id: InputMode; label: string }[] = [
  { id: "html", label: "Paste HTML" },
  { id: "url", label: "Scan URL" },
];

export default function InputModeTabs({ mode, onChange }: InputModeTabsProps) {
  return (
    <div className="mb-3 flex gap-1 rounded-lg bg-slate-100 p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === m.id
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
