"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GraduationCap, Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import Container from "./Container";

/** Sticky navbar with hover mega-dropdowns (desktop) and drawer (mobile). */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 shadow-sm backdrop-blur">
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-20" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="GlobalEd home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-700 text-white">
              <GraduationCap size={22} aria-hidden />
            </span>
            <span className="font-heading text-xl font-bold text-primary-800 sm:text-2xl">
              Global<span className="text-accent-500">Ed</span>
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-primary-700"
                      : "text-neutral-700 hover:text-primary-700",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul
                      className={cn(
                        "max-h-[70vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-xl",
                        item.children.length > 6 ? "grid w-md grid-cols-2" : "w-64",
                      )}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/consultation"
              className="hidden rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-primary-950 shadow-sm transition-colors hover:bg-accent-400 sm:inline-block lg:px-6"
            >
              Free Consultation
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-md p-2 text-primary-800 hover:bg-primary-50 lg:hidden"
            >
              <Menu size={24} aria-hidden />
            </button>
          </div>
        </nav>
      </Container>
    </header>

    {/* Mobile drawer — rendered as a sibling of <header> so fixed inset-0
        resolves against the viewport, not the backdrop-blurred header. */}
    {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="absolute inset-0 bg-primary-950/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 p-5">
              <span className="font-heading text-lg font-bold text-primary-800">
                Global<span className="text-accent-500">Ed</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
              >
                <X size={22} aria-hidden />
              </button>
            </div>

            <ul className="flex-1 p-4">
              {navItems.map((item) => (
                <li key={item.label} className="border-b border-neutral-50">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGroup(openGroup === item.label ? null : item.label)
                        }
                        aria-expanded={openGroup === item.label}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-primary-700 hover:bg-primary-50"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          aria-hidden
                          className={cn(
                            "shrink-0 transition-transform duration-200",
                            openGroup === item.label && "rotate-180",
                          )}
                        />
                      </button>
                      {openGroup === item.label && (
                        <ul className="mb-2 ml-3 border-l-2 border-primary-100 pl-3">
                          <li>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
                            >
                              View all {item.label}
                            </Link>
                          </li>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-primary-50"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="p-5">
              <Link
                href="/consultation"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-accent-500 px-6 py-3 text-center text-sm font-semibold text-primary-950 hover:bg-accent-400"
              >
                Book Your Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
