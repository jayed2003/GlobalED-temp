import { branches } from "@/data/branches";
import { adminPermissionLabels, grantablePermissions } from "@/lib/validation/admin-user";
import { leadStatusOptions, messageStatusOptions } from "@/lib/inbox";
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

export const destinationsList: ListConfig = {
  section: "destinations",
  columns: [
    { key: "name", label: "Name", filter: { kind: "text", fields: ["name"] } },
    { key: "slug", label: "Slug", filter: { kind: "text", fields: ["slug"] } },
    { key: "tagline", label: "Tagline", filter: { kind: "text", fields: ["tagline"] } },
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
          { value: "live", label: "Published", where: { publishedAt: { lte: "$now" } } },
          { value: "scheduled", label: "Scheduled", where: { publishedAt: { gt: "$now" } } },
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
      filter: { kind: "select", options: branches.map((b) => ({ value: b.name, label: b.name, where: { branch: b.name } })) },
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

export const listConfigs = {
  destinations: destinationsList,
  courses: coursesList,
  blogs: blogsList,
  events: eventsList,
  testimonials: reviewsList,
  leads: leadsList,
  messages: messagesList,
  admins: adminsList,
} as const;

export type ListSection = keyof typeof listConfigs;
