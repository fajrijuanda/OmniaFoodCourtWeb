export type IndustrySegment = {
  name: string;
  need: string;
  offer: string;
};

export type Industry = {
  name: string;
  icon: string;
  pain: string;
  solution: string;
  color:
    | "food-orange"
    | "health-blue"
    | "retail-green"
    | "commerce-pink"
    | "education-purple"
    | "professional-cyan"
    | "distribution-indigo"
    | "manufacturing-teal"
    | "property-violet"
    | "franchise-amber"
    | "event-rose"
    | "public-sky";
  segments: IndustrySegment[];
};

export const industries: Industry[] = [
  {
    name: "Food & Beverage",
    icon: "Utensils",
    pain: "Cashier, raw materials, crew shifts, and outlet performance are disconnected.",
    solution: "F&B POS, digital menu, raw material inventory, kitchen flow, and outlet dashboard.",
    color: "food-orange",
    segments: [
      { name: "Cafe", need: "Menu, tables, cashier, loyalty, and barista performance.", offer: "Cafe POS, table order, loyalty, daily sales dashboard." },
      { name: "Restaurant", need: "Dine-in, reservation, kitchen order, and service charge.", offer: "Reservation, KDS, table management, split bill, outlet report." },
      { name: "Cloud Kitchen", need: "Order aggregator, production, stock, and delivery.", offer: "Order hub, recipe costing, raw material inventory, delivery status." },
      { name: "Bakery", need: "Daily production, batch, pre-order, and display stock.", offer: "Production plan, batch stock, pre-order, waste report." },
      { name: "Food Court", need: "Multiple tenants, settlement, tenant reports, and promos.", offer: "Tenant POS, settlement report, promo rules, admin dashboard." }
    ]
  },
  {
    name: "Healthcare & Clinics",
    icon: "Stethoscope",
    pain: "Registration, medical records, pharmacy, cashier, and reports are still separate.",
    solution: "ClinicOps, patient booking, pharmacy, cashier, reminders, and owner dashboard.",
    color: "health-blue",
    segments: [
      { name: "General Clinic", need: "Queue, medical records, prescriptions, and cashier.", offer: "ClinicOps, patient booking, e-prescription, billing, doctor dashboard." },
      { name: "Dental Clinic", need: "Doctor schedule, odontogram, treatments, and follow-ups.", offer: "Dental booking, dental chart, treatment plan, check-up reminder." },
      { name: "Beauty Clinic", need: "Treatments, member packages, product stock, and repeat visits.", offer: "Treatment CRM, membership, product POS, care reminder." },
      { name: "Veterinary Clinic", need: "Pet data, vaccines, grooming, medicine, and owner reminder.", offer: "Pet profile, vaccine schedule, booking, pharmacy, WhatsApp reminder." },
      { name: "Pharmacy", need: "Medicine stock, expiry date, cashier, and sales report.", offer: "Pharmacy POS, expiry alert, inventory, supplier order, report." }
    ]
  },
  {
    name: "Retail & Stores",
    icon: "Store",
    pain: "Transactions, stock, returns, and branch reports are hard to monitor real-time.",
    solution: "POS, inventory, product catalog, loyalty, and multi-branch reports.",
    color: "retail-green",
    segments: [
      { name: "Minimarket", need: "Fast cashier, shelf stock, barcode, and cashier shift.", offer: "Barcode POS, shift report, stock opname, promo engine." },
      { name: "Hardware Store", need: "Size variants, wholesale price, accounts payable/receivable, and delivery.", offer: "Variant inventory, customer pricing, invoice, delivery tracking." },
      { name: "Fashion Store", need: "Sizes, colors, online catalog, and branch stock.", offer: "SKU matrix, omnichannel catalog, POS, multi-branch stock." },
      { name: "Electronics Store", need: "Serial number, warranty, return, and service claim.", offer: "Serial tracking, warranty module, return flow, service ticket." },
      { name: "Retail Pharmacy", need: "OTC medicine sales, stock, suppliers, and expiry.", offer: "Retail POS, batch tracking, expiry alert, supplier dashboard." }
    ]
  },
  {
    name: "E-Commerce & Marketplaces",
    icon: "ShoppingBag",
    pain: "Orders, payments, shipping, catalog, and customer service are scattered.",
    solution: "Online store, payment gateway, order management, CRM, and chatbot.",
    color: "commerce-pink",
    segments: [
      { name: "D2C Brand", need: "Own store, checkout, promos, and customer retention.", offer: "D2C storefront, payment, voucher, CRM, email/WA follow-up." },
      { name: "Online Fashion", need: "Product variants, size chart, campaigns, and returns.", offer: "Variant catalog, size guide, campaign page, return request." },
      { name: "Beauty Store", need: "Bundles, membership, reviews, and repeat orders.", offer: "Product bundle, membership, review widget, reorder automation." },
      { name: "Electronics", need: "Warranty, specs, pre-orders, and limited stock.", offer: "Spec catalog, warranty info, pre-order, stock notification." },
      { name: "Digital Products", need: "Instant access, invoices, licenses, and support.", offer: "Digital checkout, auto delivery, license key, helpdesk." },
      { name: "Social Commerce Intelligence", need: "Product, creator, live, ads, and competitor signals are scattered and hard to turn into action.", offer: "Guided setup, product radar, creator fit score, competitor watchlist, live cockpit, campaign planner, and automated reports." }
    ]
  },
  {
    name: "Education & Courses",
    icon: "GraduationCap",
    pain: "Registration, class schedules, attendance, payments, and student progress are manual.",
    solution: "Light LMS, class booking, student portal, invoices, and academic dashboard.",
    color: "education-purple",
    segments: [
      { name: "Tutoring", need: "Class schedules, attendance, payments, and parent reports.", offer: "Class schedule, attendance, billing, parent progress report." },
      { name: "Language Course", need: "Student level, placement test, classes, and certificates.", offer: "Placement test, level tracking, class booking, certificate." },
      { name: "Bootcamp", need: "Batches, mentors, assignments, progress, and placement.", offer: "Cohort portal, task submission, mentor dashboard, career tracker." },
      { name: "School", need: "Admissions, student data, announcements, and payments.", offer: "Admission portal, student data, announcement, invoice module." },
      { name: "Training Center", need: "Registration, trainer schedule, materials, and evaluation.", offer: "Training registration, trainer schedule, material portal, feedback form." }
    ]
  },
  {
    name: "Professional Services",
    icon: "BriefcaseBusiness",
    pain: "Messy incoming leads, manual proposals, team schedules, and scattered client documents.",
    solution: "Website, CRM, consultation booking, client portal, ticketing, and automation.",
    color: "professional-cyan",
    segments: [
      { name: "Consultant", need: "Leads, proposals, milestones, and client documents.", offer: "Consulting CRM, proposal tracker, client portal, milestone board." },
      { name: "Law Firm", need: "Client intake, hearing schedules, documents, and billing.", offer: "Legal intake, case tracker, document vault, billing report." },
      { name: "Agency", need: "Briefs, tasks, creative approvals, and campaign reports.", offer: "Client brief, project board, approval flow, campaign dashboard." },
      { name: "HRIS", need: "Employee data, attendance, leave, payroll, and HR approvals are not centralized.", offer: "HRIS, employee database, attendance, leave approval, payroll, payslip, overtime, HR dashboard." },
      { name: "Architect", need: "Portfolio, consultation booking, design revisions, and files.", offer: "Portfolio site, booking, revision tracker, file handover portal." },
      { name: "Accounting Firm", need: "Client documents, tax deadlines, approvals, and invoices.", offer: "Client document portal, deadline reminder, approval, invoice." }
    ]
  },
  {
    name: "Distribution & Suppliers",
    icon: "Truck",
    pain: "B2B orders, warehouse stock, field sales, and billing are often delayed.",
    solution: "Supplier portal, sales order, warehouse inventory, invoices, and routing reports.",
    color: "distribution-indigo",
    segments: [
      { name: "FMCG", need: "Sales order, routes, warehouse stock, and sales targets.", offer: "Sales app, route plan, warehouse stock, sales dashboard." },
      { name: "Pharmaceuticals", need: "Batches, expiry, compliance, and pharmacy orders.", offer: "Batch tracking, expiry alert, B2B order portal, compliance report." },
      { name: "Building Materials", need: "Wholesale prices, delivery, invoices, and receivables.", offer: "B2B pricing, delivery schedule, invoice, receivable tracker." },
      { name: "Spareparts", need: "Many SKUs, compatibility, stock, and returns.", offer: "SKU search, compatibility notes, stock sync, return flow." },
      { name: "Wholesale", need: "Member price, minimum order, payments, and pickup.", offer: "Wholesale portal, MOQ rules, payment tracking, pickup schedule." }
    ]
  },
  {
    name: "Light Manufacturing",
    icon: "Factory",
    pain: "Production, raw materials, QC, costing, and delivery lack a single data source.",
    solution: "Lightweight MRP, work orders, QC checklists, inventory, and production dashboard.",
    color: "manufacturing-teal",
    segments: [
      { name: "Apparel", need: "Custom orders, materials, sizes, production, and QC.", offer: "Work order, material usage, size matrix, QC checklist." },
      { name: "Furniture", need: "Design orders, materials, timelines, production, and delivery.", offer: "Custom order, BOM, production timeline, delivery tracker." },
      { name: "Printing", need: "Prepress, design approvals, production queue, and invoices.", offer: "Design approval, job queue, print status, billing." },
      { name: "Packaged Food", need: "Production batches, expiry, QC, and distribution.", offer: "Batch production, expiry tracking, QC log, distribution report." },
      { name: "Workshop", need: "Service orders, spareparts, technicians, and job status.", offer: "Service order, parts inventory, technician schedule, job status." }
    ]
  },
  {
    name: "Property & Real Estate",
    icon: "Building2",
    pain: "Listings, buyer leads, agent follow-ups, unit booking, and documents are hard to track.",
    solution: "Listing website, property CRM, unit booking, agent dashboard, and document flow.",
    color: "property-violet",
    segments: [
      { name: "Developer", need: "Unit listings, leads, booking fees, and document progress.", offer: "Property listing, CRM, unit booking, document pipeline." },
      { name: "Broker", need: "Inventory listings, agents, buyer follow-ups, and commissions.", offer: "Listing CRM, agent dashboard, buyer follow-up, commission report." },
      { name: "Boarding House", need: "Vacant rooms, bookings, payments, and tenant complaints.", offer: "Room availability, booking, tenant billing, complaint ticket." },
      { name: "Apartment", need: "Units, tenants, bills, maintenance, and announcements.", offer: "Tenant portal, billing, maintenance ticket, announcement." },
      { name: "Property Management", need: "Vendors, work orders, inspections, and owner reports.", offer: "Vendor portal, work order, inspection checklist, owner report." }
    ]
  },
  {
    name: "Franchise & Partnerships",
    icon: "Network",
    pain: "Investor leads, outlet performance, SOPs, and branch monitoring are not integrated.",
    solution: "Franchise listings, investor CRM, outlet POS, training portal, and branch dashboard.",
    color: "franchise-amber",
    segments: [
      { name: "F&B Franchise", need: "Outlet sales, raw materials, SOPs, and quality control.", offer: "Outlet POS, raw material order, SOP portal, QC visit." },
      { name: "Laundry", need: "Weight-based orders, laundry status, branches, and complaints.", offer: "Laundry POS, order status, branch dashboard, complaint ticket." },
      { name: "Retail Franchise", need: "Outlet stock, goods transfer, promos, and royalties.", offer: "Inventory outlet, transfer stock, promo rules, royalty report." },
      { name: "Education Franchise", need: "Branch students, classes, materials, and tutor performance.", offer: "Student portal, class module, material hub, tutor report." },
      { name: "Brand Partnership", need: "Partner leads, onboarding, documents, and monitoring.", offer: "Partner CRM, onboarding checklist, document portal, performance dashboard." }
    ]
  },
  {
    name: "Events & Communities",
    icon: "CalendarDays",
    pain: "Registration, ticketing, check-in, sponsors, and participant engagement are managed manually.",
    solution: "Event website, ticketing, QR check-in, email/WA reminders, and member portal.",
    color: "event-rose",
    segments: [
      { name: "Seminar", need: "Registrations, tickets, reminders, and certificates.", offer: "Event page, ticketing, WhatsApp reminder, certificate generator." },
      { name: "Workshop", need: "Participant quota, materials, assignments, and feedback.", offer: "Registration, material portal, assignment, feedback form." },
      { name: "Expo", need: "Tenants, booths, visitors, sponsors, and check-ins.", offer: "Exhibitor portal, booth map, QR check-in, sponsor dashboard." },
      { name: "Community", need: "Members, routine events, dues, and engagement.", offer: "Member portal, event calendar, dues tracking, community broadcast." },
      { name: "Event Organizer", need: "Clients, vendors, rundowns, budget, and crew tasks.", offer: "Project board, vendor list, rundown planner, budget tracker." }
    ]
  },
  {
    name: "Public Services",
    icon: "Landmark",
    pain: "Citizen services, letter requests, public information, and reports are still slow.",
    solution: "Service portal, online requests, status tracking, dashboard, and digital archive.",
    color: "public-sky",
    segments: [
      { name: "Village", need: "Citizen letters, information, complaints, and archives.", offer: "Village portal, online letters, complaint tracking, digital archive." },
      { name: "Sub-district", need: "Administrative services, request status, and reports.", offer: "Service desk, status tracking, queue dashboard, report." },
      { name: "Foundation", need: "Donations, programs, volunteers, and transparency reports.", offer: "Donation page, program dashboard, volunteer CRM, public report." },
      { name: "Cooperative", need: "Members, savings and loans, billing, and reports.", offer: "Member system, loan module, billing, finance report." },
      { name: "Community Services", need: "Registration, programs, schedules, and member communication.", offer: "Registration portal, program calendar, member broadcast, dashboard." },
      { name: "Church", need: "Congregation data, event scheduling, volunteers, and donations.", offer: "Member CRM, event calendar, volunteer roster, donation tracking." }
    ]
  }
];
