"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  size?: "normal" | "flexible" | "compact";
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// Cloudflare's always-pass test key, used only outside production when no
// key is configured (mirrors src/lib/turnstile.ts on the server).
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? (process.env.NODE_ENV === "production" ? undefined : TEST_SITE_KEY);

/**
 * Cloudflare Turnstile bot check. Calls `onToken` with a fresh token once the
 * visitor passes, and with `null` when the token expires, errors, or is reset.
 * Change `resetKey` after every submission — tokens are single-use.
 *
 * Cloudflare's script (~800 KB with its challenge) only loads once it's
 * needed: when the widget scrolls near the screen or the visitor starts
 * filling in the form. Loading it with the page cost the Contact page, whose
 * form is far down, most of its PageSpeed score.
 */
export default function TurnstileWidget({
  action,
  resetKey,
  onToken,
}: {
  action: "lead" | "contact";
  resetKey: number;
  onToken: (token: string | null) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const node = container.current;
    if (!SITE_KEY || !node || wanted) return;
    const want = () => setWanted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) want();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    const form = node.closest("form");
    form?.addEventListener("focusin", want);
    return () => {
      observer.disconnect();
      form?.removeEventListener("focusin", want);
    };
  }, [wanted]);

  // Render once the script is available (it may already be loaded from an
  // earlier form on the same visit).
  useEffect(() => {
    if (!SITE_KEY || !wanted || !container.current || widgetId.current) return;
    if (!scriptReady && !window.turnstile) return;
    widgetId.current = window.turnstile!.render(container.current, {
      sitekey: SITE_KEY,
      action,
      size: "flexible",
      theme: "light",
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
      onTokenRef.current(null);
    };
  }, [scriptReady, action, wanted]);

  // New challenge after each submission.
  useEffect(() => {
    if (resetKey === 0 || !widgetId.current) return;
    window.turnstile?.reset(widgetId.current);
    onTokenRef.current(null);
  }, [resetKey]);

  if (!SITE_KEY) {
    return (
      <p role="alert" className="text-sm text-red-700">
        The security check isn&apos;t available right now. Please call or WhatsApp us instead.
      </p>
    );
  }

  return (
    <>
      {wanted && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
