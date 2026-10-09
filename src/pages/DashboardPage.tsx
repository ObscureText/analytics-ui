import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { getEventsSummaryApi, getUserApi } from "../api/analyticsApi";
import { clearStoredToken, getStoredToken } from "../api/axiosClient";
import DateRangePicker from "../components/Analytics/DateRangePicker";
import ProjectSelector from "../components/Analytics/ProjectSelector";
import SummaryCards from "../components/Analytics/SummaryCards";
import Navbar from "../components/Navbar/Navbar";
import { ShimmerSummaryGrid } from "../components/Shimmer/ShimmerCard";
import type { DateRange, EventsSummaryResponse, ProjectSummary } from "../types/analytics";
import { getInitialDateRange } from "../utils/dateUtils";

import "../components/Analytics/Analytics.css";

export const DashboardPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState<string>(location.state?.email || "");

    // Scoped Date Range state for Dashboard overview
    const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange("7d"));
    const [selectedProject, setSelectedProject] = useState<string>("ALL");

    const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    const [eventsSummary, setEventsSummary] = useState<EventsSummaryResponse>({});

    // Ensure user email is present
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

    // Dashboard overview ONLY fetches summary data to prevent unwanted API calls
    const loadSummaryData = async () => {
        setErrorBanner(null);
        setSummaryLoading(true);

        try {
            const summaryRes = await getEventsSummaryApi(dateRange.from, dateRange.to);
            setEventsSummary(summaryRes);
        } catch (err) {
            console.error("Error loading events summary", err);
            setErrorBanner("Failed to load overview summary data.");
        } finally {
            setSummaryLoading(false);
        }
    };

    useEffect(() => {
        loadSummaryData();
    }, [dateRange]);

    const projectList = useMemo(() => {
        return Object.keys(eventsSummary);
    }, [eventsSummary]);

    // Aggregated summary data across projects or selected project
    const filteredSummary = useMemo<ProjectSummary>(() => {
        if (selectedProject !== "ALL" && eventsSummary[selectedProject]) {
            return eventsSummary[selectedProject];
        }

        let ui_events = 0;
        let ui_unique_devices = 0;
        let ui_crashes = 0;
        let api_hits = 0;
        let backend_crashes = 0;

        Object.values(eventsSummary).forEach((p) => {
            ui_events += p.ui_events || 0;
            ui_unique_devices += p.ui_unique_devices || 0;
            ui_crashes += p.ui_crashes || 0;
            api_hits += p.api_hits || 0;
            backend_crashes += p.backend_crashes || 0;
        });

        return { ui_events, ui_unique_devices, ui_crashes, api_hits, backend_crashes };
    }, [eventsSummary, selectedProject]);

    const handleLogout = () => {
        clearStoredToken();
        navigate("/login", { replace: true });
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
            <Navbar email={userEmail} onLogout={handleLogout} />

            <main className="dashboard-content">
                {errorBanner && (
                    <div className="common-error-banner">
                        <span>{errorBanner}</span>
                    </div>
                )}

                {/* Dashboard Toolbar with independent DateRangePicker */}
                <div className="dashboard-toolbar">
                    <div className="toolbar-title-group">
                        <h2>Pulse Overview</h2>
                        <p>High-level system health, telemetry overview, and crash metrics</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <DateRangePicker value={dateRange} onChange={(newRange) => setDateRange(newRange)} />

                        <button
                            className="preset-btn"
                            onClick={loadSummaryData}
                            title="Refresh Summary"
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
                            <RefreshCw size={14} className={summaryLoading ? "spinner" : ""} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Project Selector Tabs */}
                {projectList.length > 0 && (
                    <ProjectSelector
                        projects={projectList}
                        selectedProject={selectedProject}
                        onSelectProject={(proj) => setSelectedProject(proj)}
                    />
                )}

                {/* Primary Information: Grouped Summary Cards (Clickable cards navigate to detail views) */}
                {summaryLoading ?
                    <ShimmerSummaryGrid />
                :   <SummaryCards summary={filteredSummary} />}
            </main>
        </div>
    );
};

export default DashboardPage;
