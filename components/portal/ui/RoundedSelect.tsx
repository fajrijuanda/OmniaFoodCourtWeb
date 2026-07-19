"use client";

import { ChevronDown } from "lucide-react";
import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ChangeEventHandler, type ReactNode } from "react";
import { cx } from "./utils";

type SelectOption = { value: string; label: ReactNode; disabled: boolean };

function readOptions(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(child)) return [];
    if (child.type === "option") {
      return [{
        value: String(child.props.value ?? child.props.children ?? ""),
        label: child.props.children,
        disabled: Boolean(child.props.disabled),
      }];
    }
    return readOptions(child.props.children);
  });
}

type RoundedSelectProps = {
  className?: string;
  children: ReactNode;
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  "aria-label"?: string;
};

export function RoundedSelect({
  className,
  children,
  value,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
}: RoundedSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const options = useMemo(() => readOptions(children), [children]);
  const selected = options.find((option) => option.value === String(value ?? "")) ?? options[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const selectOption = (nextValue: string) => {
    if (nextValue === String(value ?? "")) return setOpen(false);
    onChange?.({ target: { value: nextValue } } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cx("flex min-h-[inherit] w-full items-center justify-between gap-2 rounded-full border border-[var(--portal-border)] bg-white px-4 py-2 text-left font-black text-[var(--portal-text)] shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition hover:border-[color-mix(in_srgb,var(--portal-primary)_42%,var(--portal-border))] focus:border-[var(--portal-primary)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--portal-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-60", className)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <ChevronDown className={cx("h-4 w-4 shrink-0 text-[var(--portal-primary)] transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div id={listboxId} role="listbox" className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-72 min-w-full overflow-y-auto rounded-[20px] border border-slate-200 bg-white p-1.5 shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === selected?.value}
              disabled={option.disabled}
              onClick={() => selectOption(option.value)}
              className={cx("flex w-full items-center rounded-[14px] px-3 py-2.5 text-left text-sm font-bold transition", option.value === selected?.value ? "bg-[var(--portal-primary)] text-[var(--portal-on-primary)]" : "text-slate-700 hover:bg-[var(--portal-primary-soft)]", option.disabled && "cursor-not-allowed opacity-45")}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
