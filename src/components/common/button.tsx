/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
    "h-auto inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:!cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 disabled:bg-opacity-20 disabled:bg-slate-50 disabled:text-slate-50 transition transform hover:scale-[1.03] active:scale-[0.97]",
    {
        variants: {
            variant: {
                default:
                    "bg-ink-darkest text-white hover:bg-opacity-60 dark:bg-ink-darkest dark:text-white dark:hover:bg-opacity-60",
                destructive: "bg-red-100 text-red-500",
                destructive2:
                    "bg-red-100 text-red-500 disabled:bg-opacity-none disabled:opacity-[unset] disabled:text-opacity-50 disabled:text-red-500",
                outline:
                    "border border-white text-white hover:text-white dark:border-white dark:hover:text-white dark:hover:bg-opacity-60",
                outlinePrimary:
                    "border border-primary text-primary bg- hover:text-primary dark:border-primary dark:hover:text-primary dark:hover:bg-opacity-60 disabled:text-primary",
                outlineWhite:
                    "border border-white text-white hover:text-[#f1f1f1] dark:border-white dark:hover:text-[#f1f1f1] dark:hover:bg-opacity-60",
                secondary:
                    "bg-secondary text-primary hover:bg-secondary/80 disabled:bg-opacity-20 disabled:bg-secondary disabled:text-primary",
                secondaryOutline:
                    "border border-primary text-primary hover:text-primary/80 bg-secondary",
                ghost: "hover:bg-transparent bg-transparent hover:text-slate-900",
                link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
                white: "bg-white text-slate-900 hover:bg-opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-opacity-60",
                primary:
                    "bg-primary-gradient-light text-white hover:bg-opacity-60 dark:hover:bg-opacity-60",
                ordinary:
                    "bg-transparent text-white hover:bg-transparent whitespace-normal",
                lightBlue:
                    "bg-[#f4f4fd] text-[#3055b3] border border-[#3055b3] hover:bg-opacity-60 dark:hover:bg-opacity-60",
            },
            size: {
                default: "h-10 px-5 py-3",
                xs: "h-6 px-2.5 py-1.5",
                sm: "h-9 rounded-[10px] px-4 py-2",
                md: "h-10 rounded-[10px] px-5 py-3 xl:min-w-[120px]",
                lg: "h-12 rounded-[10px] px-8 py-2.5 xl:min-w-[120px]",
                "xl": "h-[51px] px-8 py-3 text-lg rounded-[12px] xl:min-w-[150px]",
                icon: "size-10",
                noSize: "!h-fit !w-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            fullWidth = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={`${cn(buttonVariants({ variant, size, className }))} ${fullWidth && "w-full"}`}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
