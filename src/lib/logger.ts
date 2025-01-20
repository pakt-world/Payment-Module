/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { isProductionEnvironment } from "../utils";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LoggerOptions {
    level: LogLevel;
    message: string;
    meta?: Record<string, any> | any[]; // Any additional info you want to log
}

class Logger {
    private static isProduction = isProductionEnvironment;

    static log({ level, message, meta }: LoggerOptions) {
        if (this.isProduction) {
            // Send logs to an external service if needed
            this.sendToService({ level, message, meta });
        } else {
            // Log to the console in development
            this.logToConsole(level, message, meta);
        }
    }

    private static sendToService({ level, message, meta }: LoggerOptions) {
        // Replace with actual logging service call, e.g., Sentry, LogRocket, etc.
        console.log(`[Service Log] - ${level.toUpperCase()}: ${message}`, meta);
    }

    private static logToConsole(
        level: LogLevel,
        message: string,
        meta?: Record<string, any>
    ) {
        const logMethod = {
            info: console.info, // @ts-ignore
            warn: console.warn, // @ts-ignore
            error: console.error, // @ts-ignore
            debug: console.debug, // @ts-ignore
        }[level];

        logMethod(`[${level.toUpperCase()}]: ${message}`, meta || "");
    }

    // Shortcut methods
    static info(message: string, meta?: Record<string, any>) {
        this.log({ level: "info", message, meta });
    }

    static warn(message: string, meta?: Record<string, any>) {
        this.log({ level: "warn", message, meta });
    }

    static error(message: string, meta?: Record<string, any>) {
        this.log({ level: "error", message, meta });
    }

    static debug(message: string, meta?: Record<string, any>) {
        this.log({ level: "debug", message, meta });
    }
}

export default Logger;
