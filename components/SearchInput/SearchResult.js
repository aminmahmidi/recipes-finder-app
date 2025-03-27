// app/components/SearchResult.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "./Pagination";

export default function SearchResult({ results }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  if (!results || results.length === 0) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
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
      {error && (
        <div style={{
          color: "red",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid red",
          borderRadius: "4px",
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "16px",
        marginTop: "16px",
      }}>
        {currentResults.map((result) => (
          <Link
            key={result.id}
            href={`/recipes/${result.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              position: "relative",
            }}
            onClick={(e) => handleRecipeClick(result.id, e)}
          >
            <div style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
              cursor: "pointer",
              height: "100%",
              position: "relative",
            }}>
              {loadingId === result.id && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}>
                  <div>Loading recipe...</div>
                </div>
              )}

              {result.image && (
                <img
                  src={result.image}
                  alt={result.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{ padding: "12px" }}>
                <h3 style={{ fontWeight: "500", margin: "0" }}>{result.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination - will only show if totalPages > 1 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}