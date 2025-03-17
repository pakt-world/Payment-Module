/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
// import dayjs from "dayjs";
// import dayjsTimezone from "dayjs/plugin/timezone";
// import dayjsUtc from "dayjs/plugin/utc";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { IGetRequestSignatureParam, IGetRequestSignature, ITheme } from "../types";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
const isProductionEnvironment = true;


const getRequestSignature = ({
  url,
  publicKey,
  clientId,
}: IGetRequestSignatureParam): IGetRequestSignature => {
  const timestamp = Date.now();
  const payload = {
      url,
      "time-stamp": String(timestamp),
      "client-id": clientId,
  };
  const dataStr = JSON.stringify(payload);
  const hash = CryptoJS.HmacSHA256(dataStr, String(publicKey));
  const signature = hash.toString();
  return { signature, timeStamp: String(timestamp) };
};

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

function sentenceCase(str: string): string {
	if (!str || typeof str !== "string") {
		return ""; // Handle empty or invalid input
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
  cn,
  isProductionEnvironment,
  getRequestSignature,
  applyTheme,
  sleep,
  sentenceCase,
}
