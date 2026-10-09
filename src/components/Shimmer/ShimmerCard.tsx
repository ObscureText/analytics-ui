import React from "react";
import "./ShimmerCard.css";

export const ShimmerSummaryGrid: React.FC = () => {
    return (
        <div className="shimmer-grid">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="shimmer-card">
                    <div className="shimmer shimmer-line sm"></div>
                    <div className="shimmer shimmer-line lg"></div>
                    <div className="shimmer shimmer-line md"></div>
                </div>
            ))}
        </div>
    );
};

export const ShimmerBlock: React.FC<{ height?: string }> = ({ height = "220px" }) => {
    return (
        <div className="shimmer-card">
            <div className="shimmer shimmer-line md"></div>
            <div className="shimmer shimmer-block" style={{ height }}></div>
        </div>
    );
};
