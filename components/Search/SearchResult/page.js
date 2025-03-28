"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination/page";
import style from "./searchResult.module.css";
import Image from "next/image";

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
      <h2 className={style.recipeTitleTop}>Search Result</h2>
      <div className={style.ResultsRecipeContainer}>
        {currentResults.map((result) => (
          <Link
          className={style.recipeTitleLink}
            key={result.id}
            href={`/recipes/${result.id}`}
            onClick={(e) => handleRecipeClick(result.id, e)}
          >
            <div className={style.recipeCard}>
              {loadingId === result.id && (
                <div>
               Loading....
                </div>
              )}
              {result.image && (
                <Image
                  width={300}
                  height={200}
                  src={result.image}
                  alt={result.title}
                  className={style.recipeImg}
                />
              )}
              <h3 className={style.recipeTitle}>{result.title}</h3>
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
