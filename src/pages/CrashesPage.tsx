import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { getBackendCrashesApi, getUICrashesApi, getUserApi } from "../api/analyticsApi";
import { getStoredToken } from "../api/axiosClient";
import CrashLogsTable from "../components/Analytics/CrashLogsTable";
import DateRangePicker from "../components/Analytics/DateRangePicker";
import ProjectSelector from "../components/Analytics/ProjectSelector";
import Navbar from "../components/Navbar/Navbar";
import { ShimmerBlock } from "../components/Shimmer/ShimmerCard";
import type { BackendCrash, BackendCrashesResponse, DateRange, UICrash, UICrashesResponse } from "../types/analytics";
import { getInitialDateRange } from "../utils/dateUtils";

import "../components/Analytics/Analytics.css";

export const CrashesPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState<string>(location.state?.email || "");

    // Independent Date Range state for Crashes page
    const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange("7d"));
    const [selectedProject, setSelectedProject] = useState<string>("ALL");

    const [loading, setLoading] = useState<boolean>(true);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    const [uiCrashes, setUiCrashes] = useState<UICrashesResponse>({});
    const [backendCrashes, setBackendCrashes] = useState<BackendCrashesResponse>({});

    useEffect(() => {
        if (!userEmail) {
            const token = getStoredToken();
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }
            getUserApi()
                .then((res) => setUserEmail(res.email))
                .catch(() => navigate("/login", { replace: true }));
        }
    }, [userEmail, navigate]);

    // Fetch only crash and exception data
    const loadCrashData = async () => {
        setLoading(true);
        setErrorBanner(null);

        try {
            const [uiCrashRes, backendCrashRes] = await Promise.all([
                getUICrashesApi(dateRange.from, dateRange.to),
                getBackendCrashesApi(dateRange.from, dateRange.to),
            ]);

            setUiCrashes(uiCrashRes);
            setBackendCrashes(backendCrashRes);
        } catch (err) {
            console.error("Failed to load crash logs", err);
            setErrorBanner("Failed to load crash diagnostic logs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCrashData();
    }, [dateRange]);

    const projectList = useMemo(() => {
        const keys = new Set<string>();
        Object.keys(uiCrashes).forEach((k) => keys.add(k));
        Object.keys(backendCrashes).forEach((k) => keys.add(k));
        return Array.from(keys);
    }, [uiCrashes, backendCrashes]);

    // Filtered UI Crashes
    const filteredUICrashes = useMemo<UICrash[]>(() => {
        if (selectedProject !== "ALL") {
            return uiCrashes[selectedProject] || [];
        }
        const list: UICrash[] = [];
        Object.values(uiCrashes).forEach((arr) => list.push(...arr));
        return list;
    }, [uiCrashes, selectedProject]);

    // Filtered Backend Crashes
    const filteredBackendCrashes = useMemo<BackendCrash[]>(() => {
        if (selectedProject !== "ALL") {
            return backendCrashes[selectedProject] || [];
        }
        const list: BackendCrash[] = [];
        Object.values(backendCrashes).forEach((arr) => list.push(...arr));
        return list;
    }, [backendCrashes, selectedProject]);

    return (
        <div className="fixed-analytics-page">
            <Navbar email={userEmail} onLogout={() => navigate("/login")} />

            <main className="dashboard-content fixed-analytics-content crashes-content">
                {errorBanner && (
                    <div className="common-error-banner">
                        <span>{errorBanner}</span>
                    </div>
                )}

                <div className="dashboard-toolbar">
                    <div className="toolbar-title-group">
                        <h2 style={{ color: "#fda4af" }}>System Crash & Exception Logs</h2>
                        <p>Comprehensive error trace inspect view for frontend crashes and backend exceptions</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <DateRangePicker value={dateRange} onChange={(newRange) => setDateRange(newRange)} />

                        <button
                            className="preset-btn"
                            onClick={loadCrashData}
                            title="Refresh Crash Logs"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                padding: "0.5rem 0.85rem",
                                borderRadius: "var(--radius-md)",
                            }}
                        >
                            <RefreshCw size={14} className={loading ? "spinner" : ""} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {projectList.length > 0 && (
                    <ProjectSelector
                        projects={projectList}
                        selectedProject={selectedProject}
                        onSelectProject={(proj) => setSelectedProject(proj)}
                    />
                )}

                {loading ?
                    <div className="crashes-loading-panel">
                        <ShimmerBlock height="100%" />
                    </div>
                :   <CrashLogsTable uiCrashes={filteredUICrashes} backendCrashes={filteredBackendCrashes} />}
            </main>
        </div>
    );
};

export default CrashesPage;
