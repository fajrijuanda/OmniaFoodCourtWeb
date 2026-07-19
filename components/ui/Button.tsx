import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  showArrow?: boolean;
};

const variants = {
  primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25",
  secondary: "border border-slate-200 bg-white text-slate-900 hover:border-blue-200 hover:bg-blue-50",
  ghost: "text-slate-700 hover:bg-slate-100"
};

export function Button({ href, variant = "primary", showArrow = false, className = "", children, ...props }: ButtonProps) {
  const classes = `focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      {showArrow ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  );
}
