import { type Config } from "tailwindcss";

import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssRadix from "tailwindcss-radix";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    prefix: "ir-",
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        screens: {
            sm: { min: "640px" },
            md: { min: "768px" },
            lg: { min: "1024px" },
            xl: { min: "1280px" },
            "2xl": { min: "1536px" },
            "2xl.max": { min: "1600px" },
            "max-sm": { max: "639px" },
        },
        extend: {
            colors: {
                primary: "var(--irs-primary)",
                info: "var(--irs-info)",
                secondary: "var(--irs-secondary)",
                "blue-lightest": "var(--irs-blue-lightest)",
                line: "var(--irs-line)",
                title: "var(--irs-title)",
                body: "var(--irs-body)",
                warning: "var(--irs-warning)",
                success: "var(--irs-success)",
                danger: "var(--irs-danger)",
                magnolia: "var(--irs-magnolia)",
                "primary-brighter": "var(--irs-primary-brighter)",
                "refer-border": "var(--irs-refer-border)",
                "exhibit-tab-list": "var(--irs-exhibit-tab-list)",
            },
            backgroundImage: {
                "btn-primary": "var(--irs-btn-primary)",
                "primary-gradient": "var(--irs-primary-gradient)",
                none: "none",
            },
            fontFamily: {
                sans: ["var(--irs-circular-std-font)", ...fontFamily.sans],
            },
            borderRadius: {
                "modal": "var(--irs-modal-radius)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--irs-radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: {
                        height: "var(--irs-radix-accordion-content-height)",
                    },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindcssRadix, tailwindcssAnimate],
};

export default config;
