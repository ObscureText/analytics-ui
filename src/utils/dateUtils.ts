import type { DateRange } from "../types/analytics";

/**
 * Get ISO start and end timestamps based on preset key or custom date strings
 */
export function getInitialDateRange(preset: string = "7d"): DateRange {
    const now = new Date();
    const past = new Date();

    if (preset === "24h") {
        past.setHours(now.getHours() - 24);
    } else if (preset === "30d") {
        past.setDate(now.getDate() - 30);
    } else {
        // Default 7d
        past.setDate(now.getDate() - 7);
    }

    return {
        from: past.toISOString(),
        to: now.toISOString(),
        label: preset,
    };
}

/**
 * Format Date to local HTML datetime-local string (YYYY-MM-DDTHH:mm)
 */
export function toDateTimeLocalString(date: Date): string {
    const pad = (num: number) => String(num).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format ISO string to IST (Asia/Kolkata) date-time string in 12-hour AM/PM format
 * Example: "8 Oct 2026, 05:30:15 PM"
 */
export function formatISTDateTime(isoString: string): string {
    if (!isoString) return "";
    try {
        const date = new Date(isoString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    } catch {
        return isoString;
    }
}
