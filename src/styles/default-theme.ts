import { ITheme } from "types";

const defaultTheme: ITheme = {
    // Brand Colors
    brandPrimary: "#007C5B",
    brandSecondary: "#ecfce5",
    brandAccent: "#17A2B8",

    // Text Colors
    headingText: "#1F2739",
    bodyText: "#6C757D",
    linkText: "#007C5B",
    inverseText: "#FFFFFF",

    // Background Colors
    formBackground: "#FFFFFF",
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    pageBackground: "#FFFFFF",
    cardBackground: "#F8FFF4",
    tabBackground: "#F0F2F5",
    tabText: "#828A9B",
    tabActiveText: "#828A9B",
    tabActiveBackground: "#FFFFFF",

    // Border Colors
    borderColor: "#E8E8E8",
    dividerColor: "#E8E8E8",
    // Interactive Elements

    buttonPrimaryBackground: "#007C5B",
    buttonPrimaryText: "#FFFFFF",
    buttonPrimaryHover: "#005A44",
    buttonOutlineBackground: "transparent",
    buttonOutlineText: "#007C5B",
    buttonOutlineBorder: "#007C5B",
    buttonOutlineHoverBackground: "#007C5B",
    buttonOutlineHoverText: "#FFFFFF",

    // Form Input Colors
    inputBackground: "#FFFFFF",
    inputBorder: "#D1D5DB",
    inputFocusBorder: "#007C5B",
    inputPlaceholder: "#9CA3AF",
    inputText: "#1F2739",
    inputLabel: "#1F2739",

    // State Colors
    errorBackground: "#FEF2F2",
    errorText: "#DC2626",
    errorBorder: "#FECACA",
    successBackground: "#F0FDF4",
    successText: "#16A34A",
    warningBackground: "#FFFBEB",
    warningText: "#D97706",

    // Gradients
    primaryGradient:
        "linear-gradient(102.28deg, #008D6C 32.23%, #11FFC7 139.92%)",
    secondaryGradient:
        "linear-gradient(102.28deg, #008D6C 32.23%, #11FFC7 139.92%)",

    // Spacing and Layout
    modalBorderRadius: "6px",

    // Nested structure for complex token groups (kept for backward compatibility)
    text: {
        primary: "#1F2739",
        secondary: "#6C757D",
        inverse: "#FFFFFF",
    },

    input: {
        background: "#FFFFFF",
        border: "#D1D5DB",
        focus: "#007C5B",
        placeholder: "#9CA3AF",
        text: "#1F2739",
        label: "#1F2739",
    },

    states: {
        error: {
            background: "#FEF2F2",
            text: "#DC2626",
            border: "#FECACA",
        },
        success: {
            background: "#F0FDF4",
            text: "#16A34A",
        },
        warning: {
            background: "#FFFBEB",
            text: "#D97706",
        },
    },
};

export default defaultTheme;
