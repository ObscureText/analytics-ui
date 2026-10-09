import axios from "axios";
import type { ApiErrorResponse } from "../types/analytics";

/**
 * Standard backend error code mapping dictionary.
 * Maps raw backend error codes to human-readable user messages.
 */
export const ERROR_CODE_MAP: Record<string, string> = {
    ANALYTICS_ERROR_BAD_REQUEST: "Bad request. Please verify your email and password format.",
    ANALYTICS_ERROR_UNAUTHORIZED: "Invalid email or password. Please check your credentials.",
    ANALYTICS_ERROR_TOKEN_EXPIRED: "Session expired. Please log in again.",
    ANALYTICS_ERROR_INTERNAL_SERVER_ERROR: "We couldn't process your request. Please try again later.",
};

/**
 * Maps API errors (Axios errors or standard JS errors) to user-friendly messages.
 * Leverages the error code mapping layer.
 */
export function mapApiError(
    error: unknown,
    fallbackMessage = "An unexpected error occurred. Please try again.",
): string {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiErrorResponse | undefined;

        if (data?.error_code && ERROR_CODE_MAP[data.error_code]) {
            return ERROR_CODE_MAP[data.error_code];
        }

        if (data?.error_message) {
            return data.error_message;
        }

        if (error.response.status === 401) {
            return ERROR_CODE_MAP.ANALYTICS_ERROR_UNAUTHORIZED;
        }

        if (error.response.status === 400) {
            return ERROR_CODE_MAP.ANALYTICS_ERROR_BAD_REQUEST;
        }

        if (error.response.status >= 500) {
            return ERROR_CODE_MAP.ANALYTICS_ERROR_INTERNAL_SERVER_ERROR;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
}
