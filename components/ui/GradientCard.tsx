"use client";

import { motion } from "framer-motion";

type GradientCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function GradientCard({ children, className = "" }: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}
    >
      {children}
    </motion.div>
  );
}
