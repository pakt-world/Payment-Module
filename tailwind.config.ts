import { type Config } from "tailwindcss";

import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssRadix from "tailwindcss-radix";
import tailwindcssAnimate from "tailwindcss-animate";

const Prefix = "pam-";
const PrefixExt = "pams-";

const RenderPrefixVariable = (value:string) => `var(--${PrefixExt}${value})`;

const config: Config = {
    prefix: Prefix,
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
      screens: {
          sm: { min: "640px" },
          md: { min: "768px" },
          lg: { min: "1024px" },
          xl: { min: "1280px" },
          "2xl": { min: "1536px" },
          "2xl.max": { min: "1600px" },
          "2xl-5": "1600px",
          "1xl": "1440px",
          "max-sm": { max: "639px" },
          "3xl": "1600px",
      },
      extend: {
          colors: {
            primary: RenderPrefixVariable("primary"),
            info: RenderPrefixVariable("info"),
            secondary: RenderPrefixVariable("secondary"),
            "blue-lightest": RenderPrefixVariable("blue-lightest"),
            "blue-darkest": RenderPrefixVariable("blue-darkest"),
            line: RenderPrefixVariable("line"),
            title: RenderPrefixVariable("title"),
            body: RenderPrefixVariable("body"),
            warning: RenderPrefixVariable("warning"),
            success: RenderPrefixVariable("success"),
            danger: RenderPrefixVariable("danger"),
            magnolia: RenderPrefixVariable("magnolia"),
            "primary-brighter": RenderPrefixVariable("primary-brighter"),
            "refer-border": RenderPrefixVariable("refer-border"),
            "exhibit-tab-list": RenderPrefixVariable("exhibit-tab-list"),
            "modal-color": RenderPrefixVariable("modal-color"),
            "modal-bd": RenderPrefixVariable("modal-bd"),
          },
          backgroundImage: {
            "btn-primary": RenderPrefixVariable("btn-primary"),
            "primary-gradient": RenderPrefixVariable("primary-gradient"),
            none: "none",
          },
          fontFamily: {
            sans: [RenderPrefixVariable("circular-std-font"), ...fontFamily.sans],
          },
          borderRadius: {
            "modal": RenderPrefixVariable("modal-radius"),
          },
          keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: RenderPrefixVariable("radix-accordion-content-height") },
            },
            "accordion-up": {
                from: { height: RenderPrefixVariable("radix-accordion-content-height"), },
                to: { height: "0" },
            },
            overlayShow: {
              from: { opacity: "0" },
              to: { opacity: "1" },
            },
            contentShow: {
              from: {
                opacity: "0",
                transform: "translate(-50%, -48%) scale(0.96)",
              },
              to: {
                opacity: "1",
                transform: "translate(-50%, -50%) scale(1)",
              },
            },
          },
          animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
            overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
            contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          },
          transitionDuration: {
            DEFAULT: "150ms",
          },
          screens: {
            "xs": "375px",
          },
      },
    },
    plugins: [tailwindcssRadix, tailwindcssAnimate],
};

export default config;
