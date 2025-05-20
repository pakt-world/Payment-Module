/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { ITheme } from "../types";
const isProductionEnvironment = true;

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const applyTheme = (theme: ITheme) => {
  const root = document.documentElement;

  Object.keys(theme).forEach((key) => {
      const value = theme[key as keyof typeof theme] || ""; // Provide a fallback value
      root.style.setProperty(`--pams-${key}`, value);
  });
};

const sleep = (milliseconds: number) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

export {
  cn,
  isProductionEnvironment,
  applyTheme,
  sleep,
}
