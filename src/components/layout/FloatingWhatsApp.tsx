import { MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/content/settings";

/** Floating WhatsApp chat button — visible on every page. */
export default async function FloatingWhatsApp() {
  const site = await getSiteSettings();
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=Hi%20GlobalEd%2C%20I%27d%20like%20a%20free%20consultation`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GlobalEd on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <MessageCircle size={28} aria-hidden />
    </a>
  );
}
