import React from "react";
import { Server, Activity } from "lucide-react";

interface APIHitsByPathChartProps {
    hitsByPath: Record<string, number>;
}

export const APIHitsByPathChart: React.FC<APIHitsByPathChartProps> = ({ hitsByPath }) => {
    const pathEntries = Object.entries(hitsByPath).sort((a, b) => b[1] - a[1]);
    const totalPathHits = pathEntries.reduce((acc, [, val]) => acc + val, 0);

    return (
        <div className="chart-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="chart-card-header">
                <div className="chart-card-title">
                    <Server size={18} />
                    <span>API Hits by Path</span>
                </div>
                <span className="chart-card-badge">{pathEntries.length} Endpoints</span>
            </div>

            {pathEntries.length === 0 ?
                <div className="empty-state">No API hit data recorded</div>
            :   <div className="bar-list">
                    {pathEntries.map(([path, count], idx) => {
                        const percentage = totalPathHits > 0 ? Math.round((count / totalPathHits) * 100) : 0;
                        const colors = ["emerald", "purple", "blue", "cyan", "amber"];
                        const colorClass = colors[idx % colors.length];

                        return (
                            <div key={path} className="bar-item">
                                <div className="bar-item-info">
                                    <span className="bar-item-label">{path}</span>
                                    <span className="bar-item-count">
                                        {count.toLocaleString()} ({percentage}%)
                                    </span>
                                </div>
                                <div className="bar-track">
                                    <div
                                        className={`bar-fill ${colorClass}`}
                                        style={{ width: `${Math.max(percentage, 2)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
};

interface HTTPStatusChartProps {
    hitsByStatus: Record<string, number>;
}

export const HTTPStatusChart: React.FC<HTTPStatusChartProps> = ({ hitsByStatus }) => {
    const statusEntries = Object.entries(hitsByStatus).sort((a, b) => b[1] - a[1]);

    const getStatusClass = (code: string) => {
        if (code.startsWith("2")) return "s2xx";
        if (code.startsWith("4")) return "s4xx";
        if (code.startsWith("5")) return "s5xx";
        return "s2xx";
    };

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div className="chart-card-title">
                    <Activity size={18} />
                    <span>HTTP Status Code Distribution</span>
                </div>
            </div>

            {statusEntries.length === 0 ?
                <div className="empty-state">No status code distribution available</div>
            :   <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {statusEntries.map(([statusCode, count]) => {
                        const pillClass = getStatusClass(statusCode);
                        return (
                            <div
                                key={statusCode}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    background: "rgba(15, 23, 42, 0.6)",
                                    border: "1px solid var(--border-color)",
                                    padding: "0.5rem 0.85rem",
                                    borderRadius: "var(--radius-md)",
                                    flex: "0 0 auto",
                                    width: "fit-content",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <span className={`status-pill ${pillClass}`}>HTTP {statusCode}</span>
                                <span style={{ fontWeight: 700, fontSize: "1rem" }}>{count.toLocaleString()}</span>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
};

interface APIHitsChartProps {
    hitsByPath: Record<string, number>;
    hitsByStatus: Record<string, number>;
}

export const APIHitsChart: React.FC<APIHitsChartProps> = ({ hitsByPath, hitsByStatus }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <APIHitsByPathChart hitsByPath={hitsByPath} />
            </div>
            <div>
                <HTTPStatusChart hitsByStatus={hitsByStatus} />
            </div>
        </div>
    );
};

export default APIHitsChart;
