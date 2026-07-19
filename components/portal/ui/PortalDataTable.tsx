"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable } from "./DataTable";
import { PortalButton } from "./PortalButton";
import { SearchInput } from "./SearchInput";
import { RoundedSelect } from "./RoundedSelect";
type PortalTableColumn<T> = {
  label: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

export function PortalDataTable<T>({
  rows,
  columns,
  rowKey,
  searchPlaceholder = "Cari data...",
  getSearchText,
  gridTemplateColumns = "1fr 1fr 1fr",
  headerAction
}: {
  rows: T[];
  columns: PortalTableColumn<T>[];
  rowKey: (row: T) => string;
  searchPlaceholder?: string;
  getSearchText: (row: T) => string;
  gridTemplateColumns?: string;
  headerAction?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((row) => getSearchText(row).toLowerCase().includes(keyword));
  }, [getSearchText, query, rows]);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder={searchPlaceholder} className="min-w-0 flex-1 rounded-[15px] sm:rounded-[18px]" />
        
        <RoundedSelect
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="w-14 shrink-0 !px-2 !py-2 text-xs sm:w-16 sm:!px-2.5 sm:!py-2.5 sm:text-sm"
          aria-label="Tampilkan baris per halaman"
        >
          {[5, 10, 25].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </RoundedSelect>

        {headerAction}
      </div>

      <DataTable rows={visibleRows} columns={columns} rowKey={rowKey} gridTemplateColumns={gridTemplateColumns} />

      <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
        <p className="text-center text-xs font-bold text-slate-500 sm:text-left sm:text-sm">
          Menampilkan {visibleRows.length === 0 ? 0 : (normalizedPage - 1) * pageSize + 1}-{Math.min(normalizedPage * pageSize, filteredRows.length)} dari {filteredRows.length} data
        </p>
        <div className="flex items-center justify-center gap-2">
          <PortalButton
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={normalizedPage === 1}
            variant="secondary"
            className="min-h-0 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
            type="button"
          >
            Prev
          </PortalButton>
          <span className="rounded-full bg-[var(--portal-primary-soft)] px-3 py-1.5 text-xs font-black text-[var(--portal-primary)] sm:px-4 sm:py-2 sm:text-sm">{normalizedPage}/{totalPages}</span>
          <PortalButton
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={normalizedPage === totalPages}
            variant="secondary"
            className="min-h-0 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
            type="button"
          >
            Next
          </PortalButton>
        </div>
      </div>
    </div>
  );
}
