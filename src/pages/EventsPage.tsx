import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { getAPIHitsByPathApi, getAPIHitsByStatusApi, getUIEventsByNameApi, getUserApi } from "../api/analyticsApi";
import { getStoredToken } from "../api/axiosClient";
import { APIHitsByPathChart, HTTPStatusChart } from "../components/Analytics/APIHitsChart";
import DateRangePicker from "../components/Analytics/DateRangePicker";
import ProjectSelector from "../components/Analytics/ProjectSelector";
import UIEventsChart from "../components/Analytics/UIEventsChart";
import Navbar from "../components/Navbar/Navbar";
import { ShimmerBlock } from "../components/Shimmer/ShimmerCard";
import type {
    APIHitsByPathResponse,
    APIHitsByStatusResponse,
    DateRange,
    UIEventsByNameResponse,
} from "../types/analytics";
import { getInitialDateRange } from "../utils/dateUtils";

import "../components/Analytics/Analytics.css";

export const EventsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState<string>(location.state?.email || "");

    // Independent Date Range state for Events page
    const [dateRange, setDateRange] = useState<DateRange>(getInitialDateRange("7d"));
    const [selectedProject, setSelectedProject] = useState<string>("ALL");

    const [loading, setLoading] = useState<boolean>(true);
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    const [uiEventsByName, setUiEventsByName] = useState<UIEventsByNameResponse>({});
    const [apiHitsByPath, setApiHitsByPath] = useState<APIHitsByPathResponse>({});
    const [apiHitsByStatus, setApiHitsByStatus] = useState<APIHitsByStatusResponse>({});

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

    // Fetch only events and API hits telemetry data
    const loadEventsData = async () => {
        setLoading(true);
        setErrorBanner(null);

        try {
            const [byNameRes, byPathRes, byStatusRes] = await Promise.all([
                getUIEventsByNameApi(dateRange.from, dateRange.to),
                getAPIHitsByPathApi(dateRange.from, dateRange.to),
                getAPIHitsByStatusApi(dateRange.from, dateRange.to),
            ]);

            setUiEventsByName(byNameRes);
            setApiHitsByPath(byPathRes);
            setApiHitsByStatus(byStatusRes);
        } catch (err) {
            console.error("Failed to load events data", err);
            setErrorBanner("Failed to load events telemetry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEventsData();
    }, [dateRange]);

    const projectList = useMemo(() => {
        const keys = new Set<string>();
        Object.keys(uiEventsByName).forEach((k) => keys.add(k));
        Object.keys(apiHitsByPath).forEach((k) => keys.add(k));
        return Array.from(keys);
    }, [uiEventsByName, apiHitsByPath]);

    // Filtered UI Events By Name
    const filteredUIEventsByName = useMemo<Record<string, number>>(() => {
        if (selectedProject !== "ALL") {
            return uiEventsByName[selectedProject] || {};
        }
        const aggregated: Record<string, number> = {};
        Object.values(uiEventsByName).forEach((projectEvents) => {
            Object.entries(projectEvents).forEach(([name, count]) => {
                aggregated[name] = (aggregated[name] || 0) + count;
            });
        });
        return aggregated;
    }, [uiEventsByName, selectedProject]);

    // Filtered API Hits By Path
    const filteredAPIHitsByPath = useMemo<Record<string, number>>(() => {
        if (selectedProject !== "ALL") {
            return apiHitsByPath[selectedProject] || {};
        }
        const aggregated: Record<string, number> = {};
        Object.values(apiHitsByPath).forEach((projectPaths) => {
            Object.entries(projectPaths).forEach(([path, count]) => {
                aggregated[path] = (aggregated[path] || 0) + count;
            });
        });
        return aggregated;
    }, [apiHitsByPath, selectedProject]);

    // Filtered API Hits By Status
    const filteredAPIHitsByStatus = useMemo<Record<string, number>>(() => {
        if (selectedProject !== "ALL") {
            return apiHitsByStatus[selectedProject] || {};
        }
        const aggregated: Record<string, number> = {};
        Object.values(apiHitsByStatus).forEach((projectStatuses) => {
            Object.entries(projectStatuses).forEach(([status, count]) => {
                aggregated[status] = (aggregated[status] || 0) + count;
            });
        });
        return aggregated;
    }, [apiHitsByStatus, selectedProject]);

    return (
        <div className="fixed-analytics-page">
            <Navbar email={userEmail} onLogout={() => navigate("/login")} />

            <main className="dashboard-content fixed-analytics-content">
                {errorBanner && (
                    <div className="common-error-banner">
                        <span>{errorBanner}</span>
                    </div>
                )}

                <div className="dashboard-toolbar">
                    <div className="toolbar-title-group">
                        <h2>Events & API Hits Breakdown</h2>
                        <p>Detailed breakdown of UI action names, API endpoint throughput, and status codes</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <DateRangePicker value={dateRange} onChange={(newRange) => setDateRange(newRange)} />

                        <button
                            className="preset-btn"
                            onClick={loadEventsData}
                            title="Refresh Events"
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
                    <div className="events-split-layout">
                        <div className="events-left-col">
                            <ShimmerBlock height="100%" />
                        </div>
                        <div className="events-right-col">
                            <div className="events-right-top">
                                <ShimmerBlock height="100%" />
                            </div>
                            <div className="events-right-bottom">
                                <ShimmerBlock height="120px" />
                            </div>
                        </div>
                    </div>
                :   <div className="events-split-layout">
                        {/* Left Side: UI Events by Name (full height top-to-bottom with internal scroll) */}
                        <div className="events-left-col">
                            <UIEventsChart eventsByName={filteredUIEventsByName} />
                        </div>

                        {/* Right Side: Split horizontally into API Hits by Path (top) and HTTP Status Codes (bottom) */}
                        <div className="events-right-col">
                            <div className="events-right-top">
                                <APIHitsByPathChart hitsByPath={filteredAPIHitsByPath} />
                            </div>
                            <div className="events-right-bottom">
                                <HTTPStatusChart hitsByStatus={filteredAPIHitsByStatus} />
                            </div>
                        </div>
                    </div>
                }
            </main>
        </div>
    );
};

export default EventsPage;
