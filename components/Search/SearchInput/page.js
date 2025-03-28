"use client";
import Link from "next/link";
import style from "./SearchInput.module.css";
import Image from "next/image";

export default function SearchInput({
  query,
  setQuery,
  isLoading,
  isDropdownOpen,
  setIsDropdownOpen,
  results,
  handleSearch,
  dropdownRef,
  setShowResults,
}) {
  return (
    <div ref={dropdownRef} className={style.InputContainer}>
      <input
        type="text"
        className={style.Input}
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

      {isDropdownOpen && results.length > 0 && !isLoading && (
        <div className={style.SearchResultsContainer}>
          {isLoading && <div className={style.loaderContainer}>Loading...</div>}
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
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={50}
                      height={50}
                      className={style.dropDownImg}
                    />
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
        !isLoading && <div>No recipes found</div>}
    </div>
  );
}
