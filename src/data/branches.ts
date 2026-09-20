import type { Branch } from "@/types";

/**
 * Branch list — 3 offices: Panthapath, Uttara & Banasree
 */
export const branches: Branch[] = [
  {
    name: "Panthapath (Head Office)",
    address: "69/E Panthapath, Dhaka-1205",
    phones: ["019555 44772"],
    email: "info@globaled.io",
    hours: "Sat–Fri, 9:00 AM – 8:00 PM",
    // Pinned to the "GlobalEd - Panthapath" Google Maps listing (lat, lng).
    mapEmbedUrl: "https://www.google.com/maps?q=GlobalEd+-+Panthapath&ll=23.7505209,90.3882206&z=17&output=embed",
  },
  {
    name: "Uttara",
    address: "Hossain Tower, Level-05, Sector-07, Uttara, Dhaka-1230",
    phones: ["019555 44772"],
    email: "info@globaled.io",
    hours: "Sat–Fri, 9:00 AM – 8:00 PM",
    // Pinned to the "GlobalEd Uttara" Google Maps listing (lat, lng).
    mapEmbedUrl: "https://www.google.com/maps?q=GlobalEd+Uttara&ll=23.8736187,90.4001127&z=17&output=embed",
  },
  {
    name: "Banasree",
    address: "46/6 Block-M, Banasree, Khilgaon, Dhaka",
    phones: ["019555 44772"],
    email: "info@globaled.io",
    hours: "Sat–Fri, 9:00 AM – 8:00 PM",
    // Pinned to the "GlobalEd Banasree" Google Maps listing (lat, lng).
    mapEmbedUrl: "https://www.google.com/maps?q=GlobalEd+Banasree&ll=23.7583557,90.4474437&z=17&output=embed",
  },
];
