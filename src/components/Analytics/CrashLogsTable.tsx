import React, { useMemo, useState } from "react";
import { AlertOctagon, AlertTriangle, Bug, Layers, Search } from "lucide-react";
import type { BackendCrash, UICrash } from "../../types/analytics";
import { formatISTDateTime } from "../../utils/dateUtils";

interface CrashLogsTableProps {
    uiCrashes: UICrash[];
    backendCrashes: BackendCrash[];
}

interface UnifiedCrashItem {
    id: string;
    type: "UI" | "BACKEND";
    target: string; // device_id or path
    error_message: string;
    created_at: string;
}

export const CrashLogsTable: React.FC<CrashLogsTableProps> = ({ uiCrashes, backendCrashes }) => {
    const [activeFilter, setActiveFilter] = useState<"all" | "ui" | "backend">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Unified logs list sorted by created_at timestamp descending
    const combinedLogs = useMemo<UnifiedCrashItem[]>(() => {
        const list: UnifiedCrashItem[] = [];

        uiCrashes.forEach((item, index) => {
            list.push({
                id: `ui-${index}-${item.created_at}`,
                type: "UI",
                target: item.device_id,
                error_message: item.error_message,
                created_at: item.created_at,
            });
        });

        backendCrashes.forEach((item, index) => {
            list.push({
                id: `backend-${index}-${item.created_at}`,
                type: "BACKEND",
                target: item.path,
                error_message: item.error_message,
                created_at: item.created_at,
            });
        });

        // Sort descending by timestamp (most recent crashes first)
        return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [uiCrashes, backendCrashes]);

    // Filter by category and search query
    const filteredLogs = useMemo(() => {
        return combinedLogs.filter((log) => {
            if (activeFilter === "ui" && log.type !== "UI") return false;
            if (activeFilter === "backend" && log.type !== "BACKEND") return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            return (
                log.error_message.toLowerCase().includes(q) ||
                log.target.toLowerCase().includes(q) ||
                log.type.toLowerCase().includes(q)
            );
        });
    }, [combinedLogs, activeFilter, searchQuery]);

    return (
        <div className="chart-card">
            <div className="chart-card-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="chart-card-title">
                        <Bug size={20} style={{ color: "#f43f5e" }} />
                        <span>Crash & Exception Logs</span>
                        <span
                            className="chart-card-badge"
                            style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185" }}
                        >
                            {combinedLogs.length} Total Logs
                        </span>
                    </div>

                    {/* Filter Toggle Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: "0.25rem",
                            background: "var(--bg-color)",
                            padding: "0.25rem",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                        }}
                    >
                        <button
                            className={`preset-btn ${activeFilter === "all" ? "active" : ""}`}
                            onClick={() => setActiveFilter("all")}
                            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                            <Layers size={14} />
                            <span>Both ({combinedLogs.length})</span>
                        </button>
                        <button
                            className={`preset-btn ${activeFilter === "ui" ? "active" : ""}`}
                            onClick={() => setActiveFilter("ui")}
                            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                            <AlertTriangle size={14} />
                            <span>UI Crashes ({uiCrashes.length})</span>
                        </button>
                        <button
                            className={`preset-btn ${activeFilter === "backend" ? "active" : ""}`}
                            onClick={() => setActiveFilter("backend")}
                            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                            <AlertOctagon size={14} />
                            <span>Backend Crashes ({backendCrashes.length})</span>
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", position: "relative", minWidth: "260px" }}>
                    <Search size={15} style={{ position: "absolute", left: "0.75rem", color: "var(--text-muted)" }} />
                    <input
                        type="text"
                        placeholder="Search ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.45rem 0.75rem 0.45rem 2.2rem",
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--text-main)",
                            fontSize: "0.85rem",
                        }}
                    />
                </div>
            </div>

            {/* Single Unified Table with internal vertical scrolling so whole page does not scroll */}
            <div className="table-container">
                {filteredLogs.length === 0 ?
                    <div className="empty-state">No crash or exception logs found for this selection</div>
                :   <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: "160px", minWidth: "160px" }}>Error Type</th>
                                <th style={{ width: "220px" }}>Device / API Path</th>
                                <th>Error Message</th>
                                <th style={{ width: "220px", minWidth: "220px" }}>Timestamp (IST AM/PM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map((log) => (
                                <tr key={log.id}>
                                    <td style={{ width: "160px", minWidth: "160px" }}>
                                        {log.type === "UI" ?
                                            <span
                                                className="status-pill s4xx"
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.35rem",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <AlertTriangle size={13} />
                                                UI Crash
                                            </span>
                                        :   <span
                                                className="status-pill s5xx"
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.35rem",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <AlertOctagon size={13} />
                                                API Crash
                                            </span>
                                        }
                                    </td>
                                    <td>
                                        <span className="code-text">{log.target}</span>
                                    </td>
                                    <td className="error-text">{log.error_message}</td>
                                    <td
                                        style={{ color: "var(--text-muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                                    >
                                        {formatISTDateTime(log.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default CrashLogsTable;
