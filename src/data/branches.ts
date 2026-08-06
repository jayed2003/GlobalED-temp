import type { Branch } from "@/types";

/**
 * Branch list from globaled.io — 2 offices: Panthapath & Uttara
 */
export const branches: Branch[] = [
  {
    name: "Panthapath (Head Office)",
    address: "69/E Panthapath, Dhaka-1205",
    phones: ["019555 44772"],
    email: "info@globaled.io",
    hours: "Sat–Fri, 9:00 AM – 8:00 PM",
    mapEmbedUrl: "https://www.google.com/maps?q=69%2FE+Panthapath,+Dhaka-1205,+Bangladesh&output=embed",
  },
  {
    name: "Uttara",
    address: "Hossain Tower, Level-05, Sector-07, Uttara, Dhaka-1230",
    phones: ["019555 44772"],
    email: "info@globaled.io",
    hours: "Sat–Fri, 9:00 AM – 8:00 PM",
    mapEmbedUrl: "https://www.google.com/maps?q=Hossain+Tower,+Level-05,+Sector-07,+Uttara,+Dhaka-1230,+Bangladesh&output=embed",
  },
];
