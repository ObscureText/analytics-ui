import axiosClient from "./axiosClient";
import type {
    APIHitsByPathResponse,
    APIHitsByStatusResponse,
    BackendCrashesResponse,
    EventsSummaryResponse,
    LoginResponse,
    UICrashesResponse,
    UIEventsByNameResponse,
    User,
} from "../types/analytics";

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/api/analytics/auth/login", {
        email,
        password,
    });
    return response.data;
};

export const getUserApi = async (): Promise<User> => {
    const response = await axiosClient.get<User>("/api/analytics/user");
    return response.data;
};

export const getEventsSummaryApi = async (from: string, to: string): Promise<EventsSummaryResponse> => {
    const response = await axiosClient.get<EventsSummaryResponse>("/api/analytics/events/summary", {
        params: { from, to },
    });
    return response.data;
};

export const getUIEventsByNameApi = async (from: string, to: string): Promise<UIEventsByNameResponse> => {
    const response = await axiosClient.get<UIEventsByNameResponse>("/api/analytics/ui-events/by-name", {
        params: { from, to },
    });
    return response.data;
};

export const getAPIHitsByPathApi = async (from: string, to: string): Promise<APIHitsByPathResponse> => {
    const response = await axiosClient.get<APIHitsByPathResponse>("/api/analytics/api-hits/by-path", {
        params: { from, to },
    });
    return response.data;
};

export const getAPIHitsByStatusApi = async (from: string, to: string): Promise<APIHitsByStatusResponse> => {
    const response = await axiosClient.get<APIHitsByStatusResponse>("/api/analytics/api-hits/by-status", {
        params: { from, to },
    });
    return response.data;
};

export const getUICrashesApi = async (from: string, to: string): Promise<UICrashesResponse> => {
    const response = await axiosClient.get<UICrashesResponse>("/api/analytics/ui-crashes", {
        params: { from, to },
    });
    return response.data;
};

export const getBackendCrashesApi = async (from: string, to: string): Promise<BackendCrashesResponse> => {
    const response = await axiosClient.get<BackendCrashesResponse>("/api/analytics/backend-crashes", {
        params: { from, to },
    });
    return response.data;
};
