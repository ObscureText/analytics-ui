import React from "react";
import { MousePointerClick } from "lucide-react";

interface UIEventsChartProps {
    eventsByName: Record<string, number>;
}

export const UIEventsChart: React.FC<UIEventsChartProps> = ({ eventsByName }) => {
    const entries = Object.entries(eventsByName).sort((a, b) => b[1] - a[1]);
    const totalCount = entries.reduce((acc, [, val]) => acc + val, 0);

    // 8 distinct high-contrast vibrant gradient colors
    const colors = ["blue", "purple", "cyan", "emerald", "amber", "rose", "indigo", "pink"];

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <div className="chart-card-title">
                    <MousePointerClick size={18} className="text-primary" />
                    <span>UI Events by Name</span>
                </div>
                <span className="chart-card-badge">{entries.length} Event Types</span>
            </div>

            {entries.length === 0 ?
                <div className="empty-state">No UI events recorded for this range</div>
            :   <div className="bar-list">
                    {entries.map(([name, count], idx) => {
                        const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                        const colorClass = colors[idx % colors.length];

                        return (
                            <div key={name} className="bar-item">
                                <div className="bar-item-info">
                                    <span className="bar-item-label">{name}</span>
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

export default UIEventsChart;
