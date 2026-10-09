import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, AlertOctagon, LayoutDashboard, LogOut, MousePointerClick, User as UserIcon } from "lucide-react";
import "./Navbar.css";

interface NavbarProps {
    email: string;
    onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ email, onLogout }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="navbar">
            <Link to="/dashboard" className="navbar-brand" style={{ textDecoration: "none" }}>
                <div className="navbar-logo">
                    <Activity size={20} />
                </div>
                <h1 className="navbar-title">Nexus Pulse</h1>
            </Link>

            <nav className="navbar-nav-links">
                <Link to="/dashboard" className={`nav-link-btn nav-overview ${isActive("/dashboard") ? "active" : ""}`}>
                    <LayoutDashboard size={16} />
                    <span>Overview</span>
                </Link>

                <Link to="/events" className={`nav-link-btn nav-events ${isActive("/events") ? "active" : ""}`}>
                    <MousePointerClick size={16} />
                    <span>Events & API Hits</span>
                </Link>

                <Link to="/crashes" className={`nav-link-btn nav-crashes ${isActive("/crashes") ? "active" : ""}`}>
                    <AlertOctagon size={16} />
                    <span>Crash Logs</span>
                </Link>
            </nav>

            <div className="navbar-user-section" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="user-badge">
                    <div className="user-avatar">
                        <UserIcon size={12} />
                    </div>
                    <span className="user-email">{email || "User"}</span>
                </div>

                <button className="btn-logout" onClick={onLogout} title="Logout">
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
