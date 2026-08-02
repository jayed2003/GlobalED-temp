import type { Branch } from "@/types";

/**
 * Branch list — placeholder addresses/phones until the company provides
 * real details. Map embeds use the keyless google.com/maps?q=...&output=embed
 * format; swap in exact share-embed URLs later.
 */
export const branches: Branch[] = [
  {
    name: "Dhanmondi (Head Office)",
    address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
    phones: ["+880 1700-000001", "+880 1700-000002"],
    email: "dhanmondi@globaled.com.bd",
    hours: "Sat–Thu, 10:00 AM – 7:00 PM",
    mapEmbedUrl: "https://www.google.com/maps?q=Dhanmondi,+Dhaka,+Bangladesh&output=embed",
  },
  {
    name: "Banani",
    address: "Level 4, Block C, Road 11, Banani, Dhaka 1213",
    phones: ["+880 1700-000003"],
    email: "banani@globaled.com.bd",
    hours: "Sat–Thu, 10:00 AM – 7:00 PM",
    mapEmbedUrl: "https://www.google.com/maps?q=Banani,+Dhaka,+Bangladesh&output=embed",
  },
  {
    name: "Chattogram",
    address: "5th Floor, GEC Circle, Chattogram 4000",
    phones: ["+880 1700-000004"],
    email: "ctg@globaled.com.bd",
    hours: "Sat–Thu, 10:00 AM – 7:00 PM",
    mapEmbedUrl: "https://www.google.com/maps?q=GEC+Circle,+Chattogram,+Bangladesh&output=embed",
  },
];
