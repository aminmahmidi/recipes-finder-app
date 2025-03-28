"use client";
import { useState, useEffect, useRef } from "react";
import SearchInput from "./SearchInput/page";
import Filters from "./Filters/page";
import ActiveFilters from "./ActiveFilters/page";
import SearchResult from "./SearchResult/page";
import style from "./SearchContainer.module.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerances: "",
    type: "",
  });

  const dropdownRef = useRef(null);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("apiKey", "e2fd6c3a11664ec29cba2b06dd17b0ad");
        params.append("number", "20");

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`
        );
        const data = await response.json();
        setResults(data.results || []);
        setIsDropdownOpen(data.results?.length > 0);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.length >= 2) {
      setShowResults(true);
      setIsDropdownOpen(false);
      setCurrentPage(1);
    }
  };

  return (
    <>
      <div className={style.SearchContainer}>
        <div className={style.SearchBar}>
          <SearchInput
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            results={results}
            handleSearch={handleSearch}
            dropdownRef={dropdownRef}
            setShowResults={setShowResults}
          />
          <button
            onClick={handleSearch}
            disabled={query.length < 2}
            className={style.searchButton}
          >
            Search
          </button>
          <Filters
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {Object.values(filters).some(Boolean) && (
          <ActiveFilters filters={filters} setFilters={setFilters} />
        )}
      </div>

      <div>
        {showResults && (
          <SearchResult
            results={results}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            resultsPerPage={resultsPerPage}
          />
        )}
      </div>
    </>
  );
}
