"use client";
import { X } from '@phosphor-icons/react/dist/ssr';
import style from './activeFilters.module.css'
export default function ActiveFilters({ filters, setFilters }) {
  return (
    <div className={style.ActiveFiltersContainer}>
      {Object.entries(filters).map(([filterType, value]) => {
        if (!value) return null;
        const displayValue = value.replace(/-/g, " ");
        return (
          <span key={`${filterType}-${value}` } className={style.ActiveFilters}>
                 <button className={style.removeFilter}
              onClick={() => setFilters((prev) => ({ ...prev, [filterType]: "" }))}
            >
              <X />
            </button>
            <span className={style.filterType}>{filterType}:</span>
            <span>{displayValue}</span>
          </span>
        );
      })}
    </div>
  );
}