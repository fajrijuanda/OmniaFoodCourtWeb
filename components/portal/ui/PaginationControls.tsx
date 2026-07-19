"use client";

import { PortalButton } from "./PortalButton";

export function PaginationControls({
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <p className="text-xs font-bold text-slate-500">
        Menampilkan {totalRows === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalRows)} dari {totalRows} data
      </p>
      <div className="flex items-center gap-2">
        <PortalButton
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          variant="secondary"
          className="min-h-0 px-4 py-2 text-xs"
          type="button"
        >
          Prev
        </PortalButton>
        <span className="rounded-full bg-[var(--portal-primary-soft)] px-4 py-2 text-xs font-black text-[var(--portal-primary)]">{page}/{totalPages}</span>
        <PortalButton
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          variant="secondary"
          className="min-h-0 px-4 py-2 text-xs"
          type="button"
        >
          Next
        </PortalButton>
      </div>
    </div>
  );
}
