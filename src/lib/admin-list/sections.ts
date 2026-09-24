import { adminPermissionLabels, grantablePermissions } from "@/lib/validation/admin-user";
import { leadStatusOptions, messageStatusOptions } from "@/lib/inbox";
import { ENTITY_LABELS } from "@/lib/activity";
import type { ListConfig } from "./core";

/**
 * One config per admin list. `columns` match the table's columns in order;
 * each column's filter is the control shown under its header.
 */

const readFilter = {
  key: "read",
  label: "Read",
  filter: {
    kind: "select" as const,
    options: [
      { value: "unread", label: "Unread", where: { readAt: null } },
      { value: "read", label: "Read", where: { readAt: { not: null } } },
    ],
  },
};

const created = { key: "created", label: "Created" };

/** Draft / Published column for content that can be drafted (`field` is its status column). */
const publishColumn = (field: string, label = "Status") => ({
  key: field,
  label,
  filter: {
    kind: "select" as const,
    options: [
      { value: "PUBLISHED", label: "Published", where: { [field]: "PUBLISHED" } },
      { value: "DRAFT", label: "Draft", where: { [field]: "DRAFT" } },
    ],
  },
});

export const destinationsList: ListConfig = {
  section: "destinations",
  columns: [
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "slug", label: "Slug", filter: { kind: "text", fields: ["slug"] } },
    { key: "tagline", label: "Tagline", filter: { kind: "text", fields: ["tagline"] } },
    publishColumn("publishStatus"),
    created,
  ],
  searchFields: ["name", "slug", "tagline", "overview"],
  dateField: "createdAt",
  dateLabel: "Created",
  orderBy: { sortOrder: "asc" },
};

export const coursesList: ListConfig = {
  section: "courses",
  columns: [
    { key: "title", label: "Title", filter: { kind: "text", fields: ["title"] } },
    { key: "slug", label: "Slug", filter: { kind: "text", fields: ["slug"] } },
    {
      key: "category",
      label: "Category",
      filter: {
        kind: "select",
        options: [
          { value: "IELTS", label: "IELTS", where: { category: "IELTS" } },
          { value: "ENGLISH", label: "English", where: { category: "ENGLISH" } },
          { value: "OTHER_LANGUAGES", label: "Other Languages", where: { category: "OTHER_LANGUAGES" } },
        ],
      },
    },
    { key: "price", label: "Fee", filter: { kind: "text", fields: ["price"] } },
    publishColumn("publishStatus"),
    created,
  ],
  searchFields: ["title", "slug", "overview", "price", "duration", "schedule"],
  dateField: "createdAt",
  dateLabel: "Created",
  orderBy: { sortOrder: "asc" },
};

export const blogsList: ListConfig = {
  section: "blogs",
  columns: [
    { key: "title", label: "Title", filter: { kind: "text", fields: ["title"] } },
    {
      key: "category",
      label: "Category",
      filter: {
        kind: "select",
        options: [
          { value: "COUNTRY_WISE", label: "Country-wise", where: { category: "COUNTRY_WISE" } },
          { value: "SCHOLARSHIPS", label: "Scholarships", where: { category: "SCHOLARSHIPS" } },
          { value: "IELTS", label: "IELTS", where: { category: "IELTS" } },
          { value: "ENGLISH", label: "English", where: { category: "ENGLISH" } },
        ],
      },
    },
    { key: "author", label: "Author", filter: { kind: "text", fields: ["author"] } },
    { key: "published", label: "Published" },
  ],
  extraFilters: [
    {
      key: "state",
      label: "State",
      filter: {
        kind: "select",
        options: [
          { value: "live", label: "Published", where: { publishStatus: "PUBLISHED", publishedAt: { lte: "$now" } } },
          { value: "scheduled", label: "Scheduled", where: { publishStatus: "PUBLISHED", publishedAt: { gt: "$now" } } },
          { value: "draft", label: "Draft", where: { publishStatus: "DRAFT" } },
        ],
      },
    },
    {
      key: "featured",
      label: "Featured",
      filter: {
        kind: "select",
        options: [
          { value: "yes", label: "Featured", where: { featured: true } },
          { value: "no", label: "Not featured", where: { featured: false } },
        ],
      },
    },
    {
      key: "seo",
      label: "SEO",
      filter: {
        kind: "select",
        options: [{ value: "missing", label: "No meta description", where: { metaDescription: "" } }],
      },
    },
  ],
  searchFields: ["title", "slug", "excerpt", "content", "author"],
  dateField: "publishedAt",
  dateLabel: "Published",
  orderBy: { publishedAt: "desc" },
};

export const eventsList: ListConfig = {
  section: "events",
  columns: [
    { key: "title", label: "Title", filter: { kind: "text", fields: ["title"] } },
    {
      key: "status",
      label: "Status",
      filter: {
        kind: "select",
        options: [
          { value: "UPCOMING", label: "Upcoming", where: { status: "UPCOMING" } },
          { value: "PREVIOUS", label: "Previous", where: { status: "PREVIOUS" } },
        ],
      },
    },
    { key: "date", label: "Date" },
    { key: "venue", label: "Venue", filter: { kind: "text", fields: ["venue"] } },
    // "Status" here is already Upcoming / Previous.
    publishColumn("publishStatus", "Publishing"),
  ],
  searchFields: ["title", "slug", "venue", "description"],
  dateField: "date",
  dateLabel: "Event date",
  dateOnly: true,
  orderBy: { date: "desc" },
};

export const reviewsList: ListConfig = {
  section: "testimonials",
  columns: [
    { key: "image", label: "Image" },
    { key: "student", label: "Student", filter: { kind: "text", fields: ["studentName"] } },
    { key: "university", label: "University", filter: { kind: "text", fields: ["university"] } },
    { key: "country", label: "Country", filter: { kind: "text", fields: ["country"] } },
    { key: "order", label: "Order", filter: { kind: "number", field: "sortOrder" } },
    created,
  ],
  searchFields: ["studentName", "university", "country"],
  dateField: "createdAt",
  dateLabel: "Created",
  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  pageSize: 10,
};

export const leadsList: ListConfig = {
  section: "leads",
  columns: [
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "phone", label: "Phone", filter: { kind: "text", fields: ["phone"] } },
    {
      key: "type",
      label: "Type",
      filter: {
        kind: "select",
        options: [
          { value: "GENERAL", label: "Consultation", where: { formType: "GENERAL" } },
          { value: "IELTS", label: "IELTS Booking", where: { formType: "IELTS" } },
        ],
      },
    },
    {
      key: "interest",
      label: "Destination / Course",
      filter: { kind: "text", fields: ["destination.name", "course.title", "destinationOther"] },
    },
    {
      key: "status",
      label: "Status",
      filter: { kind: "select", options: leadStatusOptions.map((o) => ({ ...o, where: { status: o.value } })) },
    },
    { key: "received", label: "Received" },
  ],
  extraFilters: [
    readFilter,
    {
      key: "branch",
      label: "Branch",
      // Options: current branches plus any older name still on a lead (see the leads page).
      filter: { kind: "value", field: "branch" },
    },
    { key: "email", label: "Email", filter: { kind: "text", fields: ["email"] } },
  ],
  searchFields: ["name", "phone", "email", "branch", "message", "destinationOther", "destination.name", "course.title"],
  dateField: "createdAt",
  dateLabel: "Received",
  orderBy: { createdAt: "desc" },
  pageSize: 10,
};

export const messagesList: ListConfig = {
  section: "messages",
  columns: [
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "email", label: "Email", filter: { kind: "text", fields: ["email"] } },
    { key: "subject", label: "Subject", filter: { kind: "text", fields: ["subject"] } },
    {
      key: "status",
      label: "Status",
      filter: { kind: "select", options: messageStatusOptions.map((o) => ({ ...o, where: { status: o.value } })) },
    },
    { key: "received", label: "Received" },
  ],
  extraFilters: [readFilter],
  searchFields: ["name", "email", "subject", "message"],
  dateField: "createdAt",
  dateLabel: "Received",
  orderBy: { createdAt: "desc" },
  pageSize: 10,
};

export const adminsList: ListConfig = {
  section: "admins",
  columns: [
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "email", label: "Email", filter: { kind: "text", fields: ["email"] } },
    {
      key: "role",
      label: "Role",
      filter: {
        kind: "select",
        options: [
          { value: "ADMIN", label: "Master Admin", where: { role: "ADMIN" } },
          { value: "EDITOR", label: "Editor", where: { role: "EDITOR" } },
        ],
      },
    },
    {
      key: "permissions",
      label: "Permissions",
      filter: {
        kind: "select",
        options: grantablePermissions.map((p) => ({ value: p, label: adminPermissionLabels[p], where: { permissions: { has: p } } })),
      },
    },
    created,
  ],
  searchFields: ["name", "email"],
  dateField: "createdAt",
  dateLabel: "Created",
  orderBy: { createdAt: "asc" },
};

export const branchesList: ListConfig = {
  section: "branches",
  columns: [
    { key: "name", label: "Branch", filter: { kind: "text", fields: ["name"] } },
    { key: "address", label: "Address", filter: { kind: "text", fields: ["address"] } },
    { key: "phone", label: "Phone" },
    {
      key: "shown",
      label: "On site",
      filter: {
        kind: "select",
        options: [
          { value: "yes", label: "Shown", where: { shown: true } },
          { value: "no", label: "Hidden", where: { shown: false } },
        ],
      },
    },
  ],
  searchFields: ["name", "address", "email", "hours"],
  dateField: "createdAt",
  dateLabel: "Created",
  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
};

const shownFilter = (label: string) => ({
  key: "shown",
  label,
  filter: {
    kind: "select" as const,
    options: [
      { value: "yes", label: "Shown", where: { shown: true } },
      { value: "no", label: "Hidden", where: { shown: false } },
    ],
  },
});

export const servicesList: ListConfig = {
  section: "services",
  columns: [
    { key: "title", label: "Service", filter: { kind: "text", fields: ["title"] } },
    { key: "slug", label: "Slug", filter: { kind: "text", fields: ["slug"] } },
    {
      key: "status",
      label: "Status",
      filter: {
        kind: "select",
        options: [
          { value: "PUBLISHED", label: "Published", where: { status: "PUBLISHED" } },
          { value: "DRAFT", label: "Draft", where: { status: "DRAFT" } },
        ],
      },
    },
    { key: "updated", label: "Updated" },
  ],
  searchFields: ["title", "slug", "shortDescription", "description"],
  dateField: "updatedAt",
  dateLabel: "Updated",
  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
};

export const faqsList: ListConfig = {
  section: "faqs",
  columns: [
    { key: "question", label: "Question", filter: { kind: "text", fields: ["question"] } },
    {
      key: "category",
      label: "Category",
      filter: {
        kind: "select",
        options: [
          { value: "GENERAL", label: "General", where: { category: "GENERAL" } },
          { value: "STUDY_ABROAD", label: "Study abroad", where: { category: "STUDY_ABROAD" } },
          { value: "IELTS", label: "IELTS", where: { category: "IELTS" } },
        ],
      },
    },
    {
      key: "services",
      label: "Services page",
      filter: {
        kind: "select",
        options: [
          { value: "yes", label: "Also on Services", where: { showOnServices: true } },
          { value: "no", label: "FAQs page only", where: { showOnServices: false } },
        ],
      },
    },
    shownFilter("On site"),
  ],
  searchFields: ["question", "answer"],
  dateField: "updatedAt",
  dateLabel: "Updated",
  orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
};

export const teamList: ListConfig = {
  section: "team",
  columns: [
    { key: "photo", label: "Photo" },
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "role", label: "Role", filter: { kind: "text", fields: ["role"] } },
    {
      key: "group",
      label: "Group",
      filter: {
        kind: "select",
        options: [
          { value: "BOARD", label: "Board of Directors", where: { group: "BOARD" } },
          { value: "TEAM", label: "Team", where: { group: "TEAM" } },
        ],
      },
    },
    shownFilter("On site"),
  ],
  searchFields: ["name", "role", "bio"],
  dateField: "createdAt",
  dateLabel: "Added",
  orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
};

/**
 * The activity log (master admin only). Read-only, so it is deliberately not
 * in `listConfigs` (which bulk delete works from).
 */
export const activityList: ListConfig = {
  section: "activity",
  columns: [
    { key: "when", label: "When" },
    { key: "admin", label: "Admin", filter: { kind: "value", field: "adminName" } },
    {
      key: "action",
      label: "Action",
      filter: {
        kind: "select",
        options: [
          { value: "created", label: "Created", where: { action: "CREATED" } },
          { value: "updated", label: "Updated", where: { action: "UPDATED" } },
          { value: "published", label: "Published", where: { action: "PUBLISHED" } },
          { value: "unpublished", label: "Unpublished", where: { action: "UNPUBLISHED" } },
          { value: "deleted", label: "Deleted", where: { action: { in: ["DELETED", "BULK_DELETED"] } } },
          { value: "status", label: "Status changed", where: { action: "STATUS_CHANGED" } },
          { value: "signin", label: "Signed in", where: { action: "SIGNED_IN" } },
        ],
      },
    },
    {
      key: "type",
      label: "Section",
      filter: {
        kind: "select",
        options: Object.entries(ENTITY_LABELS).map(([value, label]) => ({ value, label, where: { entityType: value } })),
      },
    },
    { key: "item", label: "Item", filter: { kind: "text", fields: ["entityLabel"] } },
    { key: "details", label: "Details", filter: { kind: "text", fields: ["details"] } },
  ],
  searchFields: ["adminName", "entityLabel", "details"],
  dateField: "createdAt",
  dateLabel: "When",
  orderBy: { createdAt: "desc" },
  pageSize: 50,
};

export const listConfigs = {
  destinations: destinationsList,
  courses: coursesList,
  blogs: blogsList,
  events: eventsList,
  testimonials: reviewsList,
  leads: leadsList,
  messages: messagesList,
  admins: adminsList,
  branches: branchesList,
  services: servicesList,
  faqs: faqsList,
  team: teamList,
} as const;

export type ListSection = keyof typeof listConfigs;
