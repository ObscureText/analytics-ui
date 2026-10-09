import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon, AlertTriangle, ChevronRight, Monitor, MousePointer, Zap } from "lucide-react";
import type { ProjectSummary } from "../../types/analytics";

interface SummaryCardsProps {
    summary: ProjectSummary;
    onSelectMetric?: (metricKey: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, onSelectMetric }) => {
    const navigate = useNavigate();

    const handleCardClick = (route: string, key: string) => {
        if (onSelectMetric) {
            onSelectMetric(key);
        }
        navigate(route);
    };

    const eventsCards = [
        {
            key: "ui_events",
            title: "UI Events",
            value: summary.ui_events.toLocaleString(),
            subtitle: "Total client interactions",
            icon: <MousePointer size={20} />,
            colorClass: "blue",
            route: "/events",
        },
        {
            key: "ui_unique_devices",
            title: "Unique Devices",
            value: summary.ui_unique_devices.toLocaleString(),
            subtitle: "Active client device IDs",
            icon: <Monitor size={20} />,
            colorClass: "cyan",
            route: "/events",
        },
        {
            key: "api_hits",
            title: "API Hits",
            value: summary.api_hits.toLocaleString(),
            subtitle: "Backend service hits",
            icon: <Zap size={20} />,
            colorClass: "purple",
            route: "/events",
        },
    ];

    const crashCards = [
        {
            key: "ui_crashes",
            title: "UI Crashes",
            value: summary.ui_crashes.toLocaleString(),
            subtitle: "Client frontend errors",
            icon: <AlertTriangle size={20} />,
            colorClass: "amber",
            route: "/crashes",
        },
        {
            key: "backend_crashes",
            title: "Backend Crashes",
            value: summary.backend_crashes.toLocaleString(),
            subtitle: "Service level errors & 5xx hits",
            icon: <AlertOctagon size={20} />,
            colorClass: "rose",
            route: "/crashes",
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* 1. Combined Events & Telemetry Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3
                        style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "var(--text-main)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }}></span>
                        Events & Usage Telemetry
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Click any card for full event details
                    </span>
                </div>

                <div className="metrics-grid">
                    {eventsCards.map((card) => (
                        <div
                            key={card.title}
                            className="metric-card clickable"
                            onClick={() => handleCardClick(card.route, card.key)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="metric-header">
                                <span className="metric-title">{card.title}</span>
                                <div className={`metric-icon ${card.colorClass}`}>{card.icon}</div>
                            </div>
                            <div className="metric-value">{card.value}</div>
                            <div
                                className="metric-subtitle"
                                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                            >
                                <span>{card.subtitle}</span>
                                <ChevronRight size={16} className="text-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Combined Crash & Exception Diagnostics Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3
                        style={{
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#fda4af",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f43f5e" }}></span>
                        System Health & Crash Diagnostics
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Click crash cards to inspect exception logs
                    </span>
                </div>

                <div className="metrics-grid">
                    {crashCards.map((card) => (
                        <div
                            key={card.title}
                            className="metric-card clickable"
                            onClick={() => handleCardClick(card.route, card.key)}
                            style={{
                                cursor: "pointer",
                                background: "rgba(244, 63, 94, 0.05)",
                                borderColor: "rgba(244, 63, 94, 0.25)",
                            }}
                        >
                            <div className="metric-header">
                                <span className="metric-title" style={{ color: "#fca5a5" }}>
                                    {card.title}
                                </span>
                                <div className={`metric-icon ${card.colorClass}`}>{card.icon}</div>
                            </div>
                            <div className="metric-value" style={{ color: "#ffffff" }}>
                                {card.value}
                            </div>
                            <div
                                className="metric-subtitle"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    color: "#f87171",
                                }}
                            >
                                <span>{card.subtitle}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
