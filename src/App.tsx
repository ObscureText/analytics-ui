import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CrashesPage from "./pages/CrashesPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RootLoader from "./pages/RootLoader";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLoader />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/crashes" element={<CrashesPage />} />
                {/* Fallback route */}
                <Route path="*" element={<RootLoader />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
