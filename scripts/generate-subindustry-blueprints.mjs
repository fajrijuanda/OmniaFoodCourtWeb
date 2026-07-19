import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const outRoot = path.join(root, "blueprints", "sub-industries");
const cjsRequire = createRequire(import.meta.url);

function stripImports(source) {
  return source.replace(/^import .*$/gm, "");
}

function loadTsModule(relativePath, extraContext = {}) {
  const sourcePath = path.join(root, relativePath);
  const source = stripImports(fs.readFileSync(sourcePath, "utf8"));
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true
    }
  }).outputText;

  const exports = {};
  const module = { exports };
  const noop = () => null;
  const context = {
    exports,
    module,
    console,
    require: cjsRequire,
    Bot: noop,
    Database: noop,
    Globe2: noop,
    ShoppingCart: noop,
    ...extraContext
  };

  vm.runInNewContext(js, context, { filename: relativePath });
  return context.module.exports;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

function sentence(value) {
  return value.endsWith(".") ? value : `${value}.`;
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function yesNoList(items) {
  return items.map((item) => `- [x] ${item}`).join("\n");
}

function lockedList(items) {
  if (!items.length) {
    return "- Tidak ada fitur terkunci untuk tier ini.";
  }

  return items.map((item) => `- [ ] ${item}`).join("\n");
}

function getPrice(showcase, industryName, segmentName) {
  const directKey = `${industryName}::${segmentName}`;
  return showcase.segmentPriceOverride[directKey]
    ?? showcase.segmentPriceOverride[segmentName]
    ?? showcase.industryBasePrice[industryName]
    ?? ["Custom", "Custom", "Custom", "Custom"];
}

function getEntityHints(industryName, segmentName, modules) {
  const base = [
    "tenants",
    "users",
    "roles",
    "permissions",
    "audit_logs",
    "notifications",
    "files"
  ];

  const byIndustry = {
    "F&B / Kuliner": ["outlets", "menus", "orders", "recipes", "inventory_items", "shifts"],
    "Kesehatan & Klinik": ["patients", "appointments", "medical_records", "prescriptions", "billing_items"],
    "Retail & Toko": ["products", "stock_movements", "sales_orders", "customers", "suppliers"],
    "E-Commerce & Marketplace": ["catalogs", "carts", "orders", "payments", "shipments", "campaigns"],
    "Pendidikan & Kursus": ["students", "classes", "schedules", "attendance", "assignments", "payments"],
    "Jasa Profesional": ["clients", "projects", "tasks", "contracts", "invoices", "timesheets"],
    "Distribusi & Supplier": ["customers", "sales_orders", "purchase_orders", "warehouses", "routes", "invoices"],
    "Manufaktur Ringan": ["materials", "bom", "work_orders", "production_batches", "quality_checks", "finished_goods"],
    "Properti & Real Estate": ["properties", "units", "leads", "visits", "contracts", "payments"],
    "Franchise & Kemitraan": ["partners", "outlets", "brand_standards", "royalties", "audits", "supply_orders"],
    "Event & Komunitas": ["events", "tickets", "attendees", "sessions", "sponsors", "communities"],
    "Layanan Publik": ["citizens", "service_requests", "letters", "cases", "public_announcements", "programs"]
  };

  const hris = segmentName === "HRIS"
    ? ["employees", "departments", "contracts", "attendance_logs", "leave_requests", "payroll_runs", "salary_components", "tax_reports"]
    : [];

  return [...new Set([...base, ...(byIndustry[industryName] ?? []), ...hris, ...modules.map(slugify)])];
}

function getWorkflowHints(industryName, segmentName) {
  if (segmentName === "HRIS") {
    return [
      "Admin membuat struktur perusahaan, departemen, jabatan, dan aturan payroll.",
      "HR mengimpor data karyawan, kontrak, shift, cuti, dan komponen gaji.",
      "Karyawan melakukan absensi atau pengajuan cuti dari portal yang dibatasi role.",
      "Supervisor menyetujui cuti, koreksi absensi, lembur, dan reimbursement.",
      "Finance menutup payroll run, meninjau slip gaji, lalu mengekspor laporan."
    ];
  }

  const common = [
    "Owner memilih aplikasi industri, lalu memilih sub-industri yang sudah dibeli.",
    "Portal menampilkan modul aktif sesuai tier dan modul terkunci sebagai peluang upgrade.",
    "Operator menjalankan workflow harian dari modul inti, data tersimpan per tenant.",
    "Manager memantau report, approval, audit log, dan performa cabang sesuai hak akses.",
    "Developer dapat membuka seluruh modul untuk konfigurasi, debugging, dan onboarding pelanggan."
  ];

  const industrySpecific = {
    "F&B / Kuliner": "Transaksi POS, pesanan, resep, stok bahan, dan performa outlet mengalir ke dashboard owner.",
    "Kesehatan & Klinik": "Booking, rekam medis, tindakan, resep, billing, dan report klinik terhubung dalam satu alur.",
    "Retail & Toko": "Penjualan, barcode, stok, supplier, promo, dan laporan shift kasir dikonsolidasikan per outlet.",
    "E-Commerce & Marketplace": "Produk, checkout, pembayaran, order, shipment, dan campaign dipantau lintas channel.",
    "Pendidikan & Kursus": "Pendaftaran, kelas, jadwal, absensi, pembayaran, dan progress belajar tersinkronisasi.",
    "Jasa Profesional": "Lead, klien, proyek, dokumen, invoice, dan task delivery dipantau per tim.",
    "Distribusi & Supplier": "Sales order, gudang, route delivery, purchase order, invoice, dan collection dipantau end-to-end.",
    "Manufaktur Ringan": "Material, produksi, quality check, inventory, costing, dan pengiriman dipantau dari satu command center.",
    "Properti & Real Estate": "Leads, listing, unit, visit, booking, kontrak, dan pembayaran dikelola per proyek atau properti.",
    "Franchise & Kemitraan": "Outlet mitra, SOP, audit, supply order, royalty, dan performa brand dipantau pusat.",
    "Event & Komunitas": "Registrasi, ticketing, agenda, attendee, sponsor, dan follow-up komunitas dikelola satu portal.",
    "Layanan Publik": "Permohonan layanan, surat, agenda, pengumuman, dan status kasus warga dicatat transparan."
  };

  return [...common, industrySpecific[industryName]].filter(Boolean);
}

function renderTier(tier, featureRows) {
  const included = featureRows.filter((_, index) => tier.features[index]);
  const locked = featureRows.filter((_, index) => !tier.features[index]);
  const limits = tier.limits?.length ? tier.limits : ["Limit mengikuti scope final implementasi."];

  return `### ${tier.name}

**Harga:** ${tier.price} / bulan  
**Cocok untuk:** ${tier.fit}  
**Deskripsi:** ${tier.description}

**Batasan utama**
${list(limits)}

**Termasuk di tier ini**
${yesNoList(included)}

**Belum termasuk / trigger upgrade**
${lockedList(locked)}
`;
}

function renderBlueprint({ industry, segment, plans, featureRows, modules, priceSet, showcase }) {
  const tone = showcase.industryTone[industry.name] ?? "orange";
  const entities = getEntityHints(industry.name, segment.name, modules);
  const workflows = getWorkflowHints(industry.name, segment.name);

  return `# ${segment.name} Blueprint

Dokumen ini adalah blueprint sub-industri untuk Omnia All-in-One. Isi tier, harga, modul, dan fitur mengikuti data landing page saat ini.

## Identitas

- Industri: ${industry.name}
- Sub-industri: ${segment.name}
- Warna tema industri: ${industry.color} (${tone})
- Pain point utama: ${sentence(industry.pain)}
- Solusi industri: ${sentence(industry.solution)}
- Kebutuhan sub-industri: ${sentence(segment.need)}
- Penawaran Omnia: ${sentence(segment.offer)}

## Prinsip Portal

- Developer memiliki hak akses penuh ke seluruh aplikasi, sub-industri, modul, pricing, dan konfigurasi tenant.
- Pelanggan hanya melihat industri dan sub-industri yang sudah dibeli.
- Setelah memilih sub-industri, pelanggan masuk ke portal modul sesuai tier aktif.
- Modul yang tidak termasuk tier tetap tampil sebagai icon disabled.
- Saat modul disabled diklik, sistem menampilkan modal pricing untuk menyarankan upgrade tier.
- Data tenant harus terisolasi penuh per pelanggan dan dapat dikonfigurasi per outlet, cabang, user, atau karyawan sesuai model sub-industri.

## Modul Inti

${list(modules)}

## Daftar Fitur Pembanding Tier

${list(featureRows)}

## Rekomendasi Harga

- Starter: ${priceSet[0]} / bulan
- Growth: ${priceSet[1]} / bulan
- Business: ${priceSet[2]} / bulan
- Enterprise: ${priceSet[3]} / bulan

## Detail Tier

${plans.map((tier) => renderTier(tier, featureRows)).join("\n")}
## Entitas Data Awal

${list(entities)}

## Workflow Utama

${list(workflows)}

## Catatan Backend Nest.js

- Gunakan modul bounded-context per sub-industri, misalnya \`${slugify(segment.name)}\`, dengan shared module untuk auth, tenant, billing, file, notification, dan audit.
- Guard utama: tenant isolation, role permission, tier entitlement, dan module entitlement.
- Endpoint portal harus mengembalikan modul aktif dan modul disabled dalam satu response agar frontend dapat menampilkan upsell tanpa hardcode.
- Pricing modal mengambil data dari pricing service berdasarkan \`industryName\`, \`segmentName\`, dan tier pelanggan saat ini.
- Semua aksi penting harus masuk audit log: login, perubahan role, perubahan harga, approval, export, payment, dan upgrade request.

## Catatan Frontend Next.js

- Gunakan bahasa visual yang sama dengan landing page: black shell, white surface, rounded card 8px, aksen warna industri, dan maskot Omni/Odi.
- Portal sub-industri memakai layout aplikasi: sidebar modul, header tenant, area konten, dan panel status.
- Modul disabled dibuat tetap terlihat, tetapi tidak focusable sebagai route utama; klik membuka pricing modal.
- Pada mobile, sidebar berubah menjadi drawer atau bottom sheet agar modul tetap mudah dipilih.
- Mascot assistant dapat memberi ringkasan singkat tentang halaman, tetapi tidak boleh menutup konten utama.
`;
}

fs.mkdirSync(outRoot, { recursive: true });

const showcase = loadTsModule("components/showcase/showcaseData.ts");
const industriesModule = loadTsModule("data/industries.ts");
const pricing = loadTsModule("components/showcase/pricing.ts", {
  industryBasePrice: showcase.industryBasePrice,
  segmentPriceOverride: showcase.segmentPriceOverride
});

const indexRows = [];
let count = 0;

for (const industry of industriesModule.industries) {
  const industryDir = path.join(outRoot, slugify(industry.name));
  fs.mkdirSync(industryDir, { recursive: true });

  for (const segment of industry.segments) {
    const modules = pricing.getSegmentModules(segment.offer);
    const { featureRows, tiers } = pricing.buildPlans(industry.name, segment.name, modules);
    const priceSet = getPrice(showcase, industry.name, segment.name);
    const fileName = `${slugify(segment.name)}.md`;
    const fullPath = path.join(industryDir, fileName);
    const content = renderBlueprint({
      industry,
      segment,
      plans: tiers,
      featureRows,
      modules,
      priceSet,
      showcase
    });

    fs.writeFileSync(fullPath, content, "utf8");
    const relative = path.relative(outRoot, fullPath).replace(/\\/g, "/");
    indexRows.push(`- [${industry.name} / ${segment.name}](./${relative})`);
    count += 1;
  }
}

const readme = `# Blueprint Sub-Industri Omnia

Folder ini berisi blueprint detail per sub-industri untuk Omnia All-in-One. Setiap file sudah memuat modul inti, daftar fitur pembanding, dan isi masing-masing tier: Starter, Growth, Business, dan Enterprise.

Total sub-industri: ${count}

## Daftar Blueprint

${indexRows.join("\n")}
`;

fs.writeFileSync(path.join(outRoot, "README.md"), readme, "utf8");

console.log(`Generated ${count} sub-industry blueprints in ${path.relative(root, outRoot)}`);
