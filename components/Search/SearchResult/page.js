"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination/page";

export default function SearchResult({
  results = [],
  currentPage,
  setCurrentPage,
  resultsPerPage = 10,
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
    <div className="search-results">
      {error && <div className="error">{error}</div>}

      <div className="results-grid">
        {currentResults.map((result) => (
          <Link
            key={result.id}
            href={`/recipes/${result.id}`}
            onClick={(e) => handleRecipeClick(result.id, e)}
            className="result-card"
          >
            <div>
              {loadingId === result.id && (
                <div className="loading-overlay">Loading recipe...</div>
              )}
              {result.image && <img src={result.image} alt={result.title} />}
              <h3>{result.title}</h3>
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
