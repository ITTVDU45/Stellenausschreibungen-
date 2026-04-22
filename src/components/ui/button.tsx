import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-slate-900 text-white hover:bg-slate-700 focus-visible:ring-slate-900",
        secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-slate-500",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
        danger: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);

Button.displayName = "Button";
