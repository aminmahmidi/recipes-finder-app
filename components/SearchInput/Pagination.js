// app/components/Pagination.jsx
"use client";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      gap: "8px",
    }}>
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        style={{
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: currentPage === 1 ? "#f5f5f5" : "white",
          color: currentPage === 1 ? "#999" : "#333",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          style={{
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: currentPage === number ? "#4a90e2" : "white",
            color: currentPage === number ? "white" : "#333",
            cursor: "pointer",
          }}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: currentPage === totalPages ? "#f5f5f5" : "white",
          color: currentPage === totalPages ? "#999" : "#333",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
}