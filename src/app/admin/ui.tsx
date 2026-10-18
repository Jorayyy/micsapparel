import type { ReactNode } from "react";

export const cardCls = "bg-white border border-neutral-200 rounded-lg";

export const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-bold uppercase tracking-[0.16em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimary = `${btnBase} px-5 py-3 bg-black text-white text-xs hover:bg-neutral-800`;

export const btnSecondary = `${btnBase} px-5 py-3 border border-neutral-300 text-neutral-700 text-xs hover:bg-neutral-50`;

export const btnSmall = `${btnBase} px-3.5 py-2 bg-white border border-neutral-300 text-neutral-700 text-[11px] tracking-[0.14em] hover:bg-neutral-50`;

export const btnSmallDanger = `${btnBase} px-3.5 py-2 bg-white border border-red-200 text-red-600 text-[11px] tracking-[0.14em] hover:bg-red-50`;

export const chipCls =
  "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-neutral-500 mt-1.5 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Alert({ tone = "neutral", children }: { tone?: "neutral" | "error"; children: ReactNode }) {
  const tones = {
    neutral: "bg-neutral-50 border-neutral-200 text-neutral-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className={`mb-5 px-4 py-3 rounded-lg border text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${cardCls} ${className}`}>{children}</div>;
}
