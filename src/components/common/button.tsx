/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "utils";

const button = cva(
    "pam-focus:outline-none pam-py-3 pam-whitespace-nowrap pam-duration-200 pam-capitalize pam-focus-visible:ring-1 pam-focus-visible:ring-[#19A966] pam-relative pam-z-0 pam-rounded-[10px] pam-text-center pam-w-fit pam-px-6 pam-font-semibold pam-focus-visible:border-transparent",
    {
        variants: {
            variant: {
                primary:
                    "pam-border-white pam-border-opacity-10 pam-bg-btn-primary pam-text-white",
                secondary:
                    "pam-border-primary pam-border pam-text-primary pam-bg-primary-brighter pam-hover:bg-green-100 pam-duration-200 pam-font-normal",
                outline:
                    "pam-border-primary pam-border pam-text-primary pam-border-opacity-100 pam-bg-transparent pam-hover:border-opacity-50 pam-font-normal pam-duration-200",
                transparent:
                    "pam-border-transparent pam-text-primary pam-bg-transparent pam-hover:bg-[#008D6C1A] pam-duration-200",
                danger: "pam-bg-red-200 pam-text-red-600 pam-hover:bg-red-100 pam-border pam-border-transparent",
            },
            size: {
                xs: "pam-px-2 pam-py-[8px] pam-text-xs",
                sm: "pam-px-2 pam-py-2 pam-text-sm",
                md: "pam-px-3 pam-py-3 pam-text-base",
                lg: "pam-px-4 pam-py-4 pam-text-lg",
                xl: "pam-px-5 pam-py-5 pam-text-xl",
            },
            fullWidth: {
                true: "pam-w-full",
            },
            disabled: {
                true: "pam-cursor-not-allowed !pam-bg-none !pam-bg-[#E3E5E5] !pam-text-[#979C9E]",
            },
        },
        defaultVariants: {
            size: "md",
            variant: "primary",
        },
        compoundVariants: [
            {
                variant: "outline",
                disabled: true,
                className: "pam-border-gray-300",
            },
            {
                variant: "transparent",
                disabled: true,
                className: "pam-border-none pam-hover:bg-transparent",
            },
        ],
    }
);

const gradientHover = cva(
    "pam-absolute pam-inset-0 pam-rounded-lg pam-border pam-border-transparent pam-opacity-0 pam-duration-200 pam-hover:opacity-100 pam-pointer-events-none",
    {
        variants: {
            variant: {
                primary: "pam-bg-primary",
                secondary: "pam-bg-transparent",
                outline: "pam-bg-transparent",
                transparent: "pam-bg-transparent",
                danger: "pam-bg-transparent",
            },
            disabled: {
                true: "pam-bg-none pam-bg-transparent",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof button> {
    disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { variant, className, disabled, fullWidth, size, children, ...props },
        ref
    ) => {
        return (
            // eslint-disable-next-line react/button-has-type
            <button
                className={cn(
                    button({ disabled, size, fullWidth, variant }),
                    className
                )}
                disabled={disabled}
                ref={ref}
                {...props}
            >
                {children}
                <div className={gradientHover({ variant, disabled })} />
            </button>
        );
    }
);

export interface LinkButtonProps extends VariantProps<typeof button> {
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    LinkComponent?: React.ElementType;
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    (
        {
            variant,
            className,
            disabled,
            fullWidth,
            size,
            children,
            LinkComponent = "a",
            ...props
        },
        ref
    ) => {
        return (
            <LinkComponent
                {...props}
                ref={ref}
                className={cn(
                    button({ variant, disabled, size, fullWidth }),
                    className
                )}
            >
                {children}
                <div className={gradientHover({ variant, disabled })} />
            </LinkComponent>
        );
    }
);

export interface AnchorButtonProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof button> {
    disabled?: boolean;
}

export const AnchorButton = React.forwardRef<
    HTMLAnchorElement,
    AnchorButtonProps
>(
    (
        { variant, className, disabled, fullWidth, size, children, ...props },
        ref
    ) => {
        return (
            <a
                className={cn(
                    button({ variant, disabled, size, fullWidth }),
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
                <div className={gradientHover({ variant, disabled })} />
            </a>
        );
    }
);
