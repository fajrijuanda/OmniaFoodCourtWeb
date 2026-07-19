const fs = require('fs');

let f = fs.readFileSync('d:/Omnia/Portal/components/portal/industries/fnb/FnbPortal.tsx', 'utf8');

f = f.replace('"admin-tenant-dashboard": "admin-tenant-dashboard",\n  settings: "settings"', '"admin-tenant-dashboard": "admin-tenant-dashboard",\n  "order-history": "order-history",\n  settings: "settings"');

f = f.replace('if (activePage === "fnb-admin-tenant-dashboard") return "admin-tenant-dashboard";\n    if (activePage === "fnb-settings") return "settings";', 'if (activePage === "fnb-admin-tenant-dashboard") return "admin-tenant-dashboard";\n    if (activePage === "fnb-order-history") return "order-history";\n    if (activePage === "fnb-settings") return "settings";');

f = f.replace('case "admin-tenant-dashboard":\n      return <FnbOperationsLayout', 'case "admin-tenant-dashboard":\n    case "order-history":\n      return <FnbOperationsLayout');

fs.writeFileSync('d:/Omnia/Portal/components/portal/industries/fnb/FnbPortal.tsx', f);
