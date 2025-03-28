"use client";
import style from "./pagination.module.css";
export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={style.paginationContainer}>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className={style.navigationPage}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          className={[
            style.navigationNumberPage,
            currentPage === number ? style.active : "",
          ].join(" ")}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className={style.navigationPage}
      >
        Next
      </button>
    </div>
  );
}
