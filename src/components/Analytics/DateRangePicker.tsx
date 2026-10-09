import React, { useState } from "react";
import { Calendar, Clock, Check } from "lucide-react";
import type { DateRange } from "../../types/analytics";
import { getInitialDateRange, toDateTimeLocalString } from "../../utils/dateUtils";

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const [activePreset, setActivePreset] = useState<string>(value.label || "7d");
    const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

    // Custom datetime local inputs state
    const defaultFromDate = value.from ? new Date(value.from) : new Date(Date.now() - 7 * 86400000);
    const defaultToDate = value.to ? new Date(value.to) : new Date();

    const [customFrom, setCustomFrom] = useState<string>(toDateTimeLocalString(defaultFromDate));
    const [customTo, setCustomTo] = useState<string>(toDateTimeLocalString(defaultToDate));

    const presets = [
        { key: "24h", label: "24 Hours" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
    ];

    const handlePresetSelect = (presetKey: string) => {
        setActivePreset(presetKey);
        setShowCustomModal(false);
        const newRange = getInitialDateRange(presetKey);
        onChange(newRange);
    };

    const handleApplyCustom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customFrom || !customTo) return;

        const fromIso = new Date(customFrom).toISOString();
        const toIso = new Date(customTo).toISOString();

        setActivePreset("custom");
        setShowCustomModal(false);

        onChange({
            from: fromIso,
            to: toIso,
            label: "custom",
        });
    };

    return (
        <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="date-preset-group">
                <span
                    style={{ display: "flex", alignItems: "center", paddingLeft: "0.5rem", color: "var(--text-muted)" }}
                >
                    <Calendar size={15} />
                </span>

                {presets.map((preset) => (
                    <button
                        key={preset.key}
                        type="button"
                        className={`preset-btn ${activePreset === preset.key ? "active" : ""}`}
                        onClick={() => handlePresetSelect(preset.key)}
                    >
                        {preset.label}
                    </button>
                ))}

                <button
                    type="button"
                    className={`preset-btn ${activePreset === "custom" ? "active" : ""}`}
                    onClick={() => setShowCustomModal(!showCustomModal)}
                >
                    <Clock size={13} style={{ marginRight: "0.25rem" }} />
                    <span>Custom Range</span>
                </button>
            </div>

            {/* Custom Date Range Popover Form */}
            {showCustomModal && (
                <form
                    onSubmit={handleApplyCustom}
                    style={{
                        position: "absolute",
                        top: "110%",
                        right: 0,
                        zIndex: 150,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--radius-lg)",
                        padding: "1.25rem",
                        boxShadow: "var(--shadow-lg), var(--shadow-glow)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        width: "320px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid var(--border-color)",
                            paddingBottom: "0.5rem",
                        }}
                    >
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>
                            Custom Date & Time
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowCustomModal(false)}
                            style={{ background: "transparent", color: "var(--text-muted)", fontSize: "0.8rem" }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Start Date & Time</label>
                        <input
                            type="datetime-local"
                            value={customFrom}
                            onChange={(e) => setCustomFrom(e.target.value)}
                            style={{
                                padding: "0.5rem",
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-main)",
                                fontSize: "0.85rem",
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>End Date & Time</label>
                        <input
                            type="datetime-local"
                            value={customTo}
                            onChange={(e) => setCustomTo(e.target.value)}
                            style={{
                                padding: "0.5rem",
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--radius-md)",
                                color: "var(--text-main)",
                                fontSize: "0.85rem",
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "0.6rem",
                            background: "var(--primary)",
                            color: "white",
                            borderRadius: "var(--radius-md)",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.4rem",
                        }}
                    >
                        <Check size={16} />
                        <span>Apply Date Range</span>
                    </button>
                </form>
            )}
        </div>
    );
};

export default DateRangePicker;
