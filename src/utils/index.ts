
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsUtc from "dayjs/plugin/utc";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { DateMessage, ITheme, MessageProps, TMessage } from "./types";
import PDF from "../assets/images/pdf.svg";
import TXT from "../assets/images/txt.svg";
import JPG from "../assets/images/jpg.svg";
import PNG from "../assets/images/png.svg";

dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);

const ext = {
    PDF,
    TXT,
    JPG,
    PNG,
};

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

interface IGetRequestSignature {
    signature: string;
    timeStamp: string;
}

interface IGetRequestSignatureParam {
    url: string;
    publicKey: string;
    clientId: string;
}

export const getRequestSignature = ({
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

export const extractTextContent = (htmlContent: string): string => {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Remove elements that are placeholders or empty
    const elementsToRemove = doc.querySelectorAll(".empty");

    elementsToRemove.forEach((el) => {
        el.remove();
    });

    // Get the text content of the remaining elements
    const text = doc.body?.textContent || "";

    // Trim whitespace and return the text
    return text.trim();
};

export const formatNumber = (number: number): string => {
    if (number >= 1e12) {
        return `${(number / 1e12).toFixed(2)}t`;
    }
    if (number >= 1e9) {
        return `${(number / 1e9).toFixed(2)}b`;
    }
    if (number >= 1e6) {
        return `${(number / 1e6).toFixed(2)}m`;
    }
    if (number >= 1e3) {
        return `${(number / 1e3).toFixed(2)}k`;
    }
    return number.toFixed(2).toString();
};

export const formatDateHandler = (date?: string, format?: string): string => {
    // Get timezone from localStorage, then format with dayjs
    const timezone = JSON.parse(
        localStorage.getItem("u53r_71m3z0n3") as string
    ) as string;

    const d = date
        ? timezone !== undefined && timezone !== "undefined"
            ? dayjs(date)
                  .tz(timezone)
                  .format(format ?? "MMM D, YYYY")
            : dayjs(date).format(format ?? "MMM D, YYYY")
        : dayjs();

    return d as string;
};

export function formatTimestampForDisplay(
    utcTimestamp: string | number | Date
): string {
    const localTimestamp = new Date(utcTimestamp);
    // Only show the time
    return localTimestamp.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    });
}

const allowedFileTypes = [
    "pdf",
    "png",
    "doc",
    "docx",
    "ai",
    "avi",
    "gif",
    "docx",
    "csv",
    "ppt",
    "zip",
    "xsl",
    "jpg",
    "pub",
    "zip",
    "rar",
];

interface PreviewResult {
    preview: string;
    type: string;
}

export function getPreviewByType2(type: string): PreviewResult {
    let preview;
    const typP = type.split("/")[1];

    if (typP && allowedFileTypes.includes(typP))
        preview = ext[typP.toUpperCase() as keyof typeof ext];
    else preview = ext.TXT;

    return { preview, type };
}

// from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
        "Bytes",
        "KiB",
        "MiB",
        "GiB",
        "TiB",
        "PiB",
        "EiB",
        "ZiB",
        "YiB",
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export const groupMessagesByDate = (msgs: MessageProps[]): TMessage[] => {
    const defaultCategory: DateMessage = {
        category: "date",
        content: "Chat Start",
        key: "chat-start",
    };

    // Grouping the messages by date
    const grouped = msgs.reduce<Record<string, MessageProps[]>>(
        (acc, message) => {
            const dateKey = formatDateHandler(message.createdAt, "YYYY-MM-DD");
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey]?.push(message);
            return acc;
        },
        {}
    );

    // Converting the object into an array and sorting by date
    const sortedEntries = Object.entries(grouped).sort(
        (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    const messages = sortedEntries.flatMap(
        ([date, messagesForDate], dateIndex) => {
            return [
                {
                    category: "date",
                    content: date,
                    key: `${date}-${dateIndex}`,
                },
                ...messagesForDate.map((message) => ({
                    ...message,
                    category: "message" as const, // Explicitly type category as "message"
                    key: `${date}-${dateIndex}-${message._id}`, // Ensure key is always a string
                })),
            ] as TMessage[];
        }
    );

    messages.unshift(defaultCategory);
    return messages;
};

export const isDateMessage = (message: TMessage): message is DateMessage => {
    return (message as DateMessage).category === "date";
};

export const applyTheme = (theme: ITheme) => {
    const root = document.documentElement;

    Object.keys(theme).forEach((key) => {
        const value = theme[key as keyof typeof theme] || ""; // Provide a fallback value
        root.style.setProperty(`--irs-${key}`, value);
    });
};

export const isProductionEnvironment = false;
