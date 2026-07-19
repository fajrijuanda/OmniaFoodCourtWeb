import type { LucideIcon } from "lucide-react";
import { MetricCard } from "../../../../ui";

export function SocialIntelMetricCard({ label, value, trend, icon: Icon }: { label: string; value: string; trend: string; icon: LucideIcon }) {
  return <MetricCard label={label} value={value} caption={trend} icon={Icon} tone="pink" />;
}
