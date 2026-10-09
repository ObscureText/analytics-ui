import React from "react";
import { Activity } from "lucide-react";
import "./FullScreenLoader.css";

interface FullScreenLoaderProps {
    message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message = "Verifying session..." }) => {
    return (
        <div className="loader-container">
            <div className="loader-card">
                <div className="loader-brand">
                    <div className="loader-logo">
                        <Activity size={26} />
                    </div>
                    <span className="loader-title">Analytics Portal</span>
                </div>
                <div className="spinner spinner-lg"></div>
                <p className="loader-text">{message}</p>
            </div>
        </div>
    );
};

export default FullScreenLoader;
