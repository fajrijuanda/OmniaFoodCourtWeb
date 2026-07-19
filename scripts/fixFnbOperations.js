const fs = require('fs');

let f = fs.readFileSync('d:/Omnia/Portal/components/portal/industries/fnb/operations/FnbOperationsLayout.tsx', 'utf8');

// 1. Add order-history to ModuleKey
f = f.replace('  | "admin-tenant-dashboard";', '  | "admin-tenant-dashboard"\n  | "order-history";');

// 2. Add order-history to moduleMeta
f = f.replace('  "admin-tenant-dashboard": { title: "Admin Tenant Dashboard"', '  "order-history": { title: "Riwayat Pesanan", eyebrow: "Customer Orders", caption: "Pantau daftar pesanan, riwayat pembayaran, dan struk/invoice pelanggan.", icon: ReceiptText, primary: "Total Pesanan", secondary: "Total Nilai" },\n  "admin-tenant-dashboard": { title: "Admin Tenant Dashboard"');

// 3. Add ReceiptText to imports
f = f.replace('  Store,\n  Truck', '  ReceiptText,\n  Store,\n  Truck');

// 4. Update rows logic
let rowsTarget = '    if (moduleKey === "order-hub" || moduleKey === "delivery-status") {';
let rowsReplacement = `    if (moduleKey === "order-history") {
      return data.orders.map((order) => ({ id: order.id, cells: [order.invoiceNumber, new Date(order.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }), order.status, order.paymentMethod || "CASH", order.items.length + " item", rupiah(order.totalAmount)] }));
    }
    if (moduleKey === "order-hub" || moduleKey === "delivery-status") {`;
f = f.replace(rowsTarget, rowsReplacement);

// 5. Update headers logic
let headersTarget = '        : moduleKey === "batch-stock"\n          ? ["Batch", "Produk", "Kategori", "Produksi", "Display", "Status"]\n          : moduleKey === "order-hub" || moduleKey === "delivery-status"';
let headersReplacement = `        : moduleKey === "batch-stock"
          ? ["Batch", "Produk", "Kategori", "Produksi", "Display", "Status"]
          : moduleKey === "order-history"
            ? ["Invoice", "Waktu Order", "Status Dapur", "Metode Bayar", "Jumlah Item", "Total Pembayaran"]
            : moduleKey === "order-hub" || moduleKey === "delivery-status"`;
f = f.replace(headersTarget, headersReplacement);

fs.writeFileSync('d:/Omnia/Portal/components/portal/industries/fnb/operations/FnbOperationsLayout.tsx', f);
