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

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  // Render once the script is available (it may already be loaded from an
  // earlier form on the same visit).
  useEffect(() => {
    if (!SITE_KEY || !container.current || widgetId.current) return;
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
  }, [scriptReady, action]);

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
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
