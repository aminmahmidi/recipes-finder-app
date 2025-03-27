// app/components/Search.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import style from "./SearchContainer.module.css";

function SearchResult({
  results,
  currentPage,
  setCurrentPage,
  resultsPerPage,
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  if (!results || results.length === 0) return null;

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  const handleRecipeClick = async (recipeId, e) => {
    e.preventDefault();
    setLoadingId(recipeId);
    setError(null);
    try {
      router.push(`/recipes/${recipeId}`);
    } catch (err) {
      setError("Failed to load recipe details");
      console.error("Error fetching recipe:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}

      <div>
        {currentResults.map((result) => (
          <Link
            key={result.id}
            href={`/recipes/${result.id}`}
            onClick={(e) => handleRecipeClick(result.id, e)}
          >
            <div>
              {loadingId === result.id && (
                <div>
                  <div>Loading recipe...</div>
                </div>
              )}

              {result.image && <img src={result.image} alt={result.title} />}
              <div>
                <h3>{result.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button key={number} onClick={() => setCurrentPage(number)}>
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    intolerances: "",
    type: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

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
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value === prev[filterType] ? "" : value,
    }));
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (query.length >= 2) {
      setShowResults(true);
      setIsDropdownOpen(false);
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <div className={style.SearchContainer}>
        <div ref={dropdownRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
              setShowResults(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search recipes..."
          />

          {isLoading && (
            <div>
              <div>Loading...</div>
            </div>
          )}

          {isDropdownOpen && results.length > 0 && !isLoading && (
            <div>
              <ul>
                {results.map((result) => (
                  <Link href={`/recipes/${result.id}`} key={result.id}>
                    <li
                      onClick={() => {
                        setQuery(result.title);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {result.image && (
                        <img src={result.image} alt={result.title} />
                      )}
                      <span>{result.title}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}

          {isDropdownOpen &&
            query.length >= 2 &&
            results.length === 0 &&
            !isLoading && (
              <div>
                <div>No recipes found</div>
              </div>
            )}
        </div>

        <button onClick={handleSearch} disabled={query.length < 2}>
          Search
        </button>

        <div ref={filterRef}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)}>
            Filters
          </button>

          {isFilterOpen && (
            <div>
              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType}>
                  <h3>{filterType}</h3>
                  <div>
                    {options.map((option) => (
                      <button
                        key={option}
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
              <button
                onClick={() =>
                  setFilters({
                    cuisine: "",
                    diet: "",
                    intolerances: "",
                    type: "",
                  })
                }
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {Object.values(filters).some(Boolean) && (
        <div>
          {Object.entries(filters).map(([filterType, value]) => {
            if (!value) return null;
            const displayValue = value.replace("-", " ");
            return (
              <span key={`${filterType}-${value}`}>
                <span>{filterType}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, [filterType]: "" }))
                  }
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {showResults && (
        <SearchResult
          results={results}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          resultsPerPage={resultsPerPage}
        />
      )}
    </div>
  );
}
