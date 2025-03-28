"use client";

export default function ActiveFilters({ filters, setFilters }) {
  return (
    <div className="active-filters">
      {Object.entries(filters).map(([filterType, value]) => {
        if (!value) return null;
        const displayValue = value.replace(/-/g, " ");
        return (
          <span key={`${filterType}-${value}`} className="active-filter">
            <span>{filterType}:</span>
            <span>{displayValue}</span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, [filterType]: "" }))}
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  );
}