"use client";
import { useState, useRef, useEffect } from "react";
import style from "./Filters.module.css";
import { FunnelSimple } from "@phosphor-icons/react/dist/ssr";

const filterOptions = {
  cuisine: [
    "African",
    "Asian",
    "American",
    "British",
    "Chinese",
    "French",
    "Indian",
    "Italian",
    "Japanese",
    "Mediterranean",
    "Mexican",
  ],
  diet: ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Paleo"],
  intolerances: ["Dairy", "Egg", "Gluten", "Peanut", "Seafood", "Soy"],
  type: [
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
  ],
};

export default function Filters({ filters, setFilters, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value === prev[filterType] ? "" : value,
    }));
    setIsOpen(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={filterRef}>
      <button className={style.filterBtn} onClick={() => setIsOpen(!isOpen)}>
        <FunnelSimple />
      </button>

      {isOpen && (
        <div className={style.filterDropdown}>
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div className={style.filterType} key={filterType}>
              <h3>{filterType}</h3>
              <div className={style.filterOptions}>
                {options.map((option) => (
                  <button
                    key={option}
                    className={
                      filters[filterType] ===
                      option.toLowerCase().replace(" ", "-")
                        ? style.active
                        : ""
                    }
                    onClick={() =>
                      handleFilterChange(
                        filterType,
                        option.toLowerCase().replace(" ", "-")
                      )
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className={style.clearFilterBtn}
            onClick={() => {
              setFilters({
                cuisine: "",
                diet: "",
                intolerances: "",
                type: "",
              });
              setIsOpen(false);
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
