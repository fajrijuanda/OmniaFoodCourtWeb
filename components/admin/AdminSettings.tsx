"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Layers3, ListChecks, LogOut, Plus, RefreshCcw, Save, ShieldCheck, Trash2, UsersRound, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { AdminHeader, CheckboxField, EmptyState, FormField, IconButton, PortalButton, SelectField } from "@/components/portal/ui";
import { apiFetch, isSuperAdminUser, type AuthUser } from "@/lib/api";
import { clearAuthSession, getStoredUser } from "@/lib/mobile/session";

type Entity = "industries" | "sub-industries" | "tiers" | "features" | "tier-features" | "users";
type Row = Record<string, any>;

const entities: Array<{ key: Entity; label: string; icon: typeof Database }> = [
  { key: "industries", label: "Industri", icon: Database },
  { key: "sub-industries", label: "Sub", icon: Layers3 },
  { key: "tiers", label: "Tier", icon: ShieldCheck },
  { key: "features", label: "Fitur", icon: ListChecks },
  { key: "tier-features", label: "Mapping", icon: RefreshCcw },
  { key: "users", label: "Akun", icon: UsersRound }
];

const availableIcons = [
  "BriefcaseBusiness", "Building2", "CalendarDays", "Factory", "GraduationCap",
  "Landmark", "LayoutDashboard", "Network", "ShoppingBag", "Store", "Stethoscope",
  "Truck", "Utensils", "Coffee", "Cloud", "Smile", "Sparkles", "Activity", "Pill",
  "ShoppingBasket", "Hammer", "Shirt", "Monitor", "Plus", "Star", "Laptop", "Download",
  "BookOpen", "Globe", "Terminal", "School", "Presentation", "Briefcase", "Scale",
  "Lightbulb", "Users", "Compass", "Calculator", "Wrench", "Package", "Scissors",
  "Armchair", "Printer", "Search", "PenTool", "Building", "Handshake", "Home",
  "ClipboardList", "Droplets", "Tags", "Mic", "Ticket", "Calendar", "Map", "Heart",
  "Wallet", "BadgeDollarSign", "BarChart3", "Bot", "CreditCard", "FileSignature",
  "Megaphone", "MessageCircle", "ReceiptText", "ShieldCheck"
];

const availableColors = [
  { id: "food-orange", name: "Food Orange (#f97316)", hex: "#f97316" },
  { id: "health-blue", name: "Clinic Teal (#14B8A6)", hex: "#14B8A6" },
  { id: "retail-green", name: "Retail Green (#22C55E)", hex: "#22C55E" },
  { id: "commerce-pink", name: "Commerce Rose (#F43F5E)", hex: "#F43F5E" },
  { id: "education-purple", name: "Academic Cyan (#06B6D4)", hex: "#06B6D4" },
  { id: "professional-cyan", name: "Professional Cyan (#0891b2)", hex: "#0891b2" },
  { id: "distribution-indigo", name: "Distribution Purple (#8B5CF6)", hex: "#8B5CF6" },
  { id: "manufacturing-teal", name: "Manufacturing Teal (#0d9488)", hex: "#0d9488" },
  { id: "property-violet", name: "Property Blue (#315CAA)", hex: "#315CAA" },
  { id: "franchise-amber", name: "Franchise Amber (#F59E0B)", hex: "#F59E0B" },
  { id: "event-rose", name: "Event Rose (#e11d48)", hex: "#e11d48" },
  { id: "public-sky", name: "Public Lime (#84CC16)", hex: "#84CC16" },
  { id: "slate-gray", name: "Slate Gray (#475569)", hex: "#475569" },
  { id: "emerald-green", name: "Emerald Green (#10b981)", hex: "#10b981" },
];

const emptyForm: Record<Entity, Row> = {
  industries: { name: "", iconKey: "BriefcaseBusiness", colorKey: "professional-cyan", pain: "", solution: "", sortOrder: 0, isActive: true },
  "sub-industries": { industryId: "", name: "", need: "", offer: "", sortOrder: 0, isActive: true },
  tiers: { subIndustryId: "", name: "", price: "", cadence: "/ bulan", description: "", fit: "", limits: "", sortOrder: 0, highlight: false, isActive: true },
  features: { subIndustryId: "", name: "", description: "", sortOrder: 0, isActive: true },
  "tier-features": { tierId: "", featureId: "", included: true },
  users: { email: "", password: "", name: "", role: "owner", status: "active", subscriptionStatus: "unsubscribed" }
};

export function AdminSettings() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [active, setActive] = useState<Entity>("industries");
  const [rows, setRows] = useState<Row[]>([]);
  const [industries, setIndustries] = useState<Row[]>([]);
  const [subs, setSubs] = useState<Row[]>([]);
  const [tiers, setTiers] = useState<Row[]>([]);
  const [features, setFeatures] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>(emptyForm.industries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const activeMeta = entities.find((entity) => entity.key === active) ?? entities[0];
  const ActiveIcon = activeMeta.icon;

  useEffect(() => {
    const parsed = getStoredUser<AuthUser>();
    if (!isSuperAdminUser(parsed)) {
      router.replace("/login");
      return;
    }
    setUser(parsed);
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const [activeRows, industryRows, subRows, tierRows, featureRows] = await Promise.all([
        apiFetch<Row[]>(`/admin/${active}`),
        apiFetch<Row[]>("/admin/industries"),
        apiFetch<Row[]>("/admin/sub-industries"),
        apiFetch<Row[]>("/admin/tiers"),
        apiFetch<Row[]>("/admin/features")
      ]);
      setRows(activeRows);
      setIndustries(industryRows);
      setSubs(subRows);
      setTiers(tierRows);
      setFeatures(featureRows);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [active]);

  useEffect(() => {
    if (user) void load();
  }, [load, user]);

  useEffect(() => {
    setForm(emptyForm[active]);
    setEditingId(null);
  }, [active]);

  const fields = useMemo(() => Object.keys(emptyForm[active]), [active]);

  const updateField = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const normalizePayload = () => {
    const payload: Row = { ...form };
    for (const key of ["sortOrder"]) {
      if (payload[key] !== undefined) payload[key] = Number(payload[key] || 0);
    }
    if (active === "tiers" && typeof payload.limits === "string") {
      payload.limits = payload.limits.split(",").map((item: string) => item.trim()).filter(Boolean);
    }
    if (active === "features" && !payload.subIndustryId) payload.subIndustryId = null;
    return payload;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    try {
      const payload = normalizePayload();
      if (editingId) {
        await apiFetch(`/admin/${active}/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
        setMessage("Data berhasil diperbarui.");
      } else {
        await apiFetch(`/admin/${active}`, { method: "POST", body: JSON.stringify(payload) });
        setMessage("Data berhasil dibuat.");
      }
      setForm(emptyForm[active]);
      setEditingId(null);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan data.");
    }
  };

  const edit = (row: Row) => {
    setEditingId(row.id);
    const next: Row = { ...emptyForm[active], ...row };
    if (active === "tiers") next.limits = Array.isArray(row.limitsJson) ? row.limitsJson.join(", ") : "";
    if (active === "users") next.password = "";
    setForm(next);
  };

  const remove = async (id: string) => {
    setMessage("");
    await apiFetch(`/admin/${active}/${id}`, { method: "DELETE" });
    await load();
  };

  const logout = () => {
    clearAuthSession();
    router.push("/login");
  };

  const renderInput = (field: string) => {
    if (field === "isActive" || field === "highlight" || field === "included") {
      return (
        <CheckboxField key={field} label={field} checked={Boolean(form[field])} onChange={(checked) => updateField(field, checked)} />
      );
    }
    if (field === "iconKey") {
      const selectedIcon = form[field] || "BriefcaseBusiness";
      const IconComponent = (LucideIcons as any)[selectedIcon] || LucideIcons.BriefcaseBusiness;
      return (
        <label key={field} className="block relative">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">{field}</span>
          <div className="relative group">
            <select
              className="w-full appearance-none rounded-[18px] border border-slate-200 bg-white pl-12 pr-10 py-3 text-sm font-bold outline-none focus:border-orange-500 cursor-pointer"
              value={selectedIcon}
              onChange={(e) => updateField(field, e.target.value)}
            >
              {availableIcons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </label>
      );
    }
    if (field === "colorKey") {
      const selectedColor = availableColors.find(c => c.id === form[field]) || availableColors[0];
      return (
        <label key={field} className="block relative">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-400">{field}</span>
          <div className="relative group">
            <select
              className="w-full appearance-none rounded-[18px] border border-slate-200 bg-white pl-12 pr-10 py-3 text-sm font-bold outline-none focus:border-orange-500 cursor-pointer"
              value={form[field] || ""}
              onChange={(e) => updateField(field, e.target.value)}
            >
              <option value="" disabled>Pilih Warna</option>
              {availableColors.map(color => (
                <option key={color.id} value={color.id}>{color.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="block h-5 w-5 rounded-full shadow-inner" style={{ backgroundColor: selectedColor?.hex || "#ccc" }}></span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </label>
      );
    }
    if (field === "industryId") {
      return <Select key={field} label={field} value={form[field]} options={industries} onChange={(value) => updateField(field, value)} />;
    }
    if (field === "subIndustryId") {
      return <Select key={field} label={field} value={form[field] ?? ""} options={subs} onChange={(value) => updateField(field, value)} allowEmpty />;
    }
    if (field === "tierId") {
      return <Select key={field} label={field} value={form[field]} options={tiers} onChange={(value) => updateField(field, value)} />;
    }
    if (field === "featureId") {
      return <Select key={field} label={field} value={form[field]} options={features} onChange={(value) => updateField(field, value)} />;
    }
    if (field === "role") {
      return <Select key={field} label={field} value={form[field]} options={[{ id: "super_admin", name: "super_admin" }, { id: "owner", name: "owner" }, { id: "employee", name: "employee" }]} onChange={(value) => updateField(field, value)} />;
    }
    if (field === "status") {
      return <Select key={field} label={field} value={form[field]} options={[{ id: "active", name: "active" }, { id: "inactive", name: "inactive" }]} onChange={(value) => updateField(field, value)} />;
    }
    if (field === "subscriptionStatus") {
      return <Select key={field} label={field} value={form[field]} options={[{ id: "trial", name: "trial" }, { id: "subscribed", name: "subscribed" }, { id: "unsubscribed", name: "unsubscribed" }]} onChange={(value) => updateField(field, value)} />;
    }
    const textarea = ["pain", "solution", "need", "offer", "description", "fit"].includes(field);
    return (
      <FormField key={field} label={field} textarea={textarea} type={field === "password" ? "password" : "text"} value={form[field] ?? ""} onChange={(value) => updateField(field, value)} />
    );
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-[86px] border-r border-slate-200 bg-white lg:block">
        <div className="grid h-20 place-items-center">
          <BrandLogo className="h-12 w-12 rounded-[16px]" />
        </div>
        <nav className="flex flex-col items-center gap-2">
          {entities.map((entity) => {
            const Icon = entity.icon;
            return (
              <button key={entity.key} onClick={() => setActive(entity.key)} className={`grid h-16 w-16 place-items-center rounded-[18px] transition ${active === entity.key ? "bg-orange-50 text-orange-600" : "text-slate-500 hover:bg-slate-50"}`} type="button" title={entity.label}>
                <Icon className="h-6 w-6" />
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="lg:pl-[86px]">
        <AdminHeader
          eyebrow="Admin settings"
          title={activeMeta.label}
          icon={ActiveIcon}
          actions={
            <>
              <PortalButton href="/admin/customers" variant="secondary">Customers</PortalButton>
              <PortalButton href="/portal?role=developer" variant="secondary">Portal</PortalButton>
              <IconButton icon={RefreshCcw} label="Refresh" onClick={load} />
              <IconButton icon={LogOut} label="Logout" onClick={logout} className="bg-slate-950 text-white" />
            </>
          }
        />
        <header className="sticky top-[80px] z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:hidden">
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {entities.map((entity) => (
              <button key={entity.key} onClick={() => setActive(entity.key)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${active === entity.key ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"}`} type="button">
                {entity.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[430px_1fr]">
          <form onSubmit={submit} className="h-fit rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">{editingId ? "Edit data" : "Tambah data"}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{active}</p>
              </div>
              <Plus className="h-5 w-5 text-orange-500" />
            </div>
            <div className="grid gap-4">{fields.map(renderInput)}</div>
            {message ? <p className="mt-4 rounded-[16px] bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p> : null}
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white" type="submit">
              <Save className="h-4 w-4" />
              {editingId ? "Simpan perubahan" : "Buat data"}
            </button>
          </form>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Data aktif</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{loading ? "Memuat..." : `${rows.length} row`}</p>
              </div>
            </div>
            <div className="grid gap-3">
              {rows.map((row) => (
                <article key={row.id} className="grid gap-3 rounded-[18px] border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <button onClick={() => edit(row)} className="min-w-0 text-left" type="button">
                    <p className="truncate font-black">{row.name ?? row.email ?? `${row.tier?.name ?? "Tier"} -> ${row.feature?.name ?? "Feature"}`}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-500">{row.slug ?? row.role ?? row.need ?? row.description ?? row.id}</p>
                  </button>
                  <button onClick={() => remove(row.id)} className="grid h-10 w-10 place-items-center rounded-full bg-white text-rose-500 shadow-sm" type="button" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              ))}
              {!loading && rows.length === 0 ? <EmptyState /> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Select({ label, value, options, onChange, allowEmpty = false }: { label: string; value: string; options: Row[]; onChange: (value: string) => void; allowEmpty?: boolean }) {
  return <SelectField label={label} value={value ?? ""} allowEmpty={allowEmpty} emptyLabel="Global / kosong" options={options.map((option) => ({ value: option.id, label: option.name ?? option.email ?? option.id }))} onChange={(nextValue) => onChange(nextValue)} />;
}
