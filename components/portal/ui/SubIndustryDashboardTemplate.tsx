"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { ModuleCard } from "./ModuleCard";
import { PageHeader } from "./PageHeader";
import { PortalButton } from "./PortalButton";
import { PortalPanel } from "./PortalPanel";
import { StatCard } from "./StatCard";
import type { ActionDefinition, FeatureFlagMap, ModuleDefinition, StatDefinition } from "./types";

export type SubIndustryDashboardTemplateProps = {
  hero: {
    eyebrow?: string;
    title: string;
    body?: string;
    icon?: LucideIcon;
    actions?: ReactNode;
  };
  stats?: StatDefinition[];
  modules?: ModuleDefinition[];
  actions?: ActionDefinition[];
  activity?: ReactNode;
  settings?: ReactNode;
  featureFlags?: FeatureFlagMap;
  onLockedModule?: (module: ModuleDefinition) => void;
  workspace?: ReactNode;
};

function resolveModuleStatus(module: ModuleDefinition, featureFlags?: FeatureFlagMap): ModuleDefinition {
  const flag = featureFlags?.[module.key];
  if (flag === undefined) return module;
  if (typeof flag === "boolean") return { ...module, status: flag ? "enabled" : "hidden" };
  return { ...module, status: flag };
}

export function SubIndustryDashboardTemplate({
  hero,
  stats = [],
  modules = [],
  actions = [],
  activity,
  settings,
  featureFlags,
  onLockedModule,
  workspace
}: SubIndustryDashboardTemplateProps) {
  const visibleModules = modules
    .map((module) => resolveModuleStatus(module, featureFlags))
    .filter((module) => module.status !== "hidden");

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader {...hero} />

      {stats.length ? (
        <div className={`grid gap-3 ${stats.length === 3 ? "grid-cols-3" : "grid-cols-2"} md:grid-cols-2 xl:grid-cols-4`}>
          {(stats.length === 1 ? [...stats, { label: "Status data", value: "Aktif", caption: "Sinkron dengan server" }] : stats).map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      ) : null}

      {actions.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <FeatureCard
              key={action.label}
              title={action.label}
              caption={action.caption}
              icon={action.icon}
              className={action.disabled ? "opacity-50" : ""}
            />
          ))}
        </div>
      ) : null}

      {visibleModules.length ? (
        <PortalPanel>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#172033]">Modul aplikasi</h2>
              <p className="text-sm font-bold text-slate-500">Aktifkan, kunci, atau sembunyikan modul lewat konfigurasi fitur.</p>
            </div>
            <PortalButton variant="secondary">Atur fitur</PortalButton>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {visibleModules.map((module) => <ModuleCard key={module.key} module={module} onLockedModule={onLockedModule} />)}
          </div>
        </PortalPanel>
      ) : null}

      {workspace}

      {(activity || settings) ? (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          {activity ? <PortalPanel>{activity}</PortalPanel> : null}
          {settings ? <PortalPanel>{settings}</PortalPanel> : null}
        </div>
      ) : null}
    </div>
  );
}
