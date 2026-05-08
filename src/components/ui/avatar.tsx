import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const avatarVariants = tv({
  base: "relative flex shrink-0 overflow-hidden rounded-full font-bold text-white items-center justify-center uppercase transition-all select-none",
  variants: {
    size: {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-xl",
    },
    hasBorder: {
      true: "ring-2 ring-white dark:ring-zinc-950",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    hasBorder: false,
  },
});

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  name?: string;
  src?: string;
  alt?: string;
}

function stringToHslColor(str: string, s = 65, l = 45) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function Avatar({
  className,
  size,
  hasBorder,
  name,
  src,
  alt,
  style,
  ...props
}: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : null;

  // Calc background color if no src
  const bgColor = name ? stringToHslColor(name) : undefined;
  const computedStyle = !src && name ? { backgroundColor: bgColor, ...style } : style;

  return (
    <div
      className={cn(avatarVariants({ size, hasBorder }), className)}
      style={computedStyle}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
