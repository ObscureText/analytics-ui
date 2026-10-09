export interface User {
    email: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface ProjectSummary {
    ui_events: number;
    ui_unique_devices: number;
    ui_crashes: number;
    api_hits: number;
    backend_crashes: number;
}

export type EventsSummaryResponse = Record<string, ProjectSummary>;

export type UIEventsByNameResponse = Record<string, Record<string, number>>;

export type APIHitsByPathResponse = Record<string, Record<string, number>>;

export type APIHitsByStatusResponse = Record<string, Record<string, number>>;

export interface UICrash {
    device_id: string;
    error_message: string;
    created_at: string;
}

export type UICrashesResponse = Record<string, UICrash[]>;

export interface BackendCrash {
    path: string;
    error_message: string;
    created_at: string;
}

export type BackendCrashesResponse = Record<string, BackendCrash[]>;

export interface ApiErrorResponse {
    error_code?: string;
    error_message?: string;
}

export interface DateRange {
    from: string; // ISO string
    to: string; // ISO string
    label?: string;
}
