"use client";

import { Panel } from "@/components/portal/ui";
import type { PortalPage } from "../../../portalTypes";

import { ChurchJemaatPage } from "./ChurchJemaatPage";
import { ChurchKomselPage } from "./ChurchKomselPage";
import { ChurchIbadahPage } from "./ChurchIbadahPage";
import { ChurchPelayananPage } from "./ChurchPelayananPage";
import { ChurchKeuanganPage } from "./ChurchKeuanganPage";
import { ChurchAsetPage } from "./ChurchAsetPage";
import { ChurchDashboardPage } from "./ChurchDashboardPage";
import { ChurchSettingsPage } from "./ChurchSettingsPage";

export function ChurchPortal({
  activePage,
  currentTier
}: {
  activePage: PortalPage;
  currentTier: string;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--portal-primary)] sm:text-xs">
              Church Management System
            </p>
            <h1 className="mt-1.5 text-xl font-black text-[#172033] sm:mt-2 sm:text-4xl">
              {activePage.replace("church-", "").replace("church", "Overview").toUpperCase()}
            </h1>
            <p className="mt-2 max-w-2xl text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
              Sistem manajemen gereja yang terintegrasi.
            </p>
          </div>
          <span className="w-fit rounded-full bg-[var(--portal-primary-soft)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--portal-primary)] sm:px-4 sm:py-2 sm:text-xs">
            {currentTier} access
          </span>
        </div>
      </Panel>

      {activePage === "church-jemaat" ? <ChurchJemaatPage currentTier={currentTier} /> : null}
      {activePage === "church-komsel" ? <ChurchKomselPage currentTier={currentTier} /> : null}
      {activePage === "church-ibadah" ? <ChurchIbadahPage currentTier={currentTier} /> : null}
      {activePage === "church-pelayanan" ? <ChurchPelayananPage currentTier={currentTier} /> : null}
      {activePage === "church-keuangan" ? <ChurchKeuanganPage currentTier={currentTier} /> : null}
      {activePage === "church-aset" ? <ChurchAsetPage currentTier={currentTier} /> : null}
      {activePage === "church-dashboard" ? <ChurchDashboardPage currentTier={currentTier} /> : null}
      {activePage === "church-settings" ? <ChurchSettingsPage currentTier={currentTier} /> : null}
      {activePage === "church" ? (
        <Panel>
          <div className="grid place-items-center py-10 text-center sm:py-20">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--portal-primary-soft)] text-[var(--portal-primary)] sm:h-20 sm:w-20 sm:rounded-3xl">
              <svg className="h-7 w-7 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-black text-[#172033] sm:mt-6 sm:text-2xl">Modul dalam Pengembangan</h2>
            <p className="mt-2 max-w-md text-xs font-bold leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
              Halaman <strong>{activePage}</strong> ini sedang dalam proses pengembangan.
            </p>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
