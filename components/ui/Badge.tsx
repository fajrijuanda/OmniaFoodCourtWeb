type BadgeProps = {
  children: React.ReactNode;
  tone?: "blue" | "purple" | "emerald" | "orange" | "cyan" | "pink" | "slate";
};

const toneClasses = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  pink: "bg-pink-50 text-pink-700 ring-pink-200",
  slate: "bg-slate-50 text-slate-700 ring-slate-200"
};

export function Badge({ children, tone = "slate" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
