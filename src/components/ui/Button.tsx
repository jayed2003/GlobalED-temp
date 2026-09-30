import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-accent-500 text-primary-950 hover:bg-accent-600 shadow-sm",
  secondary: "bg-primary-700 text-white hover:bg-primary-600",
  outline: "border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white",
  white: "bg-white text-primary-800 hover:bg-primary-100 hover:text-primary-900",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export interface ButtonStyleOptions {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** Shared button styling for links and buttons. Hover: colour change, lift and shadow (no lift with reduced motion). */
export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,border-color,box-shadow,translate] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm disabled:translate-y-0 disabled:shadow-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
    variants[variant],
    sizes[size],
    className,
  );
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
}: ButtonStyleOptions & { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonStyleOptions & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
