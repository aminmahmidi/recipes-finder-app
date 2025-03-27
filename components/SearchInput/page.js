// app/components/Search.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
function SearchResult({ results, currentPage, setCurrentPage, resultsPerPage }) {
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
      gap: '8px',
    }}>
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
          color: currentPage === 1 ? '#999' : '#333',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button
          key={number}
          onClick={() => setCurrentPage(number)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: currentPage === number ? '#4a90e2' : 'white',
            color: currentPage === number ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
          color: currentPage === totalPages ? '#999' : '#333',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        Next
      </button>
    </div>
  );
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    diet: '',
    intolerances: '',
    type: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  
  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  const filterOptions = {
    cuisine: ['African', 'Asian', 'American', 'British', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 'Mediterranean', 'Mexican'],
    diet: ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Paleo'],
    intolerances: ['Dairy', 'Egg', 'Gluten', 'Peanut', 'Seafood', 'Soy'],
    type: ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage']
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
        params.append('query', query);
        params.append('apiKey', 'e2fd6c3a11664ec29cba2b06dd17b0ad');
        params.append('number', '20');
        
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
        console.error('Search failed:', error);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value
    }));
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    if (query.length >= 2) {
      setShowResults(true);
      setIsDropdownOpen(false);
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: '1' }} ref={dropdownRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
              setShowResults(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="Search recipes..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          
          {isLoading && (
            <div style={{
              position: 'absolute',
              width: '100%',
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: '10'
            }}>
              <div style={{ padding: '8px' }}>Loading...</div>
            </div>
          )}

          {isDropdownOpen && results.length > 0 && !isLoading && (
            <div style={{
              position: 'absolute',
              width: '100%',
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: '10',
              maxHeight: '384px',
              overflowY: 'auto'
            }}>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                {results.map((result) => (
                  <Link href={`/recipes/${result.id}`} key={result.id}>
                    <li 
                      style={{
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setQuery(result.title);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      )}
                      <span>{result.title}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}

          {isDropdownOpen && query.length >= 2 && results.length === 0 && !isLoading && (
            <div style={{
              position: 'absolute',
              width: '100%',
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: '10'
            }}>
              <div style={{ padding: '8px', color: '#666' }}>No recipes found</div>
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={query.length < 2}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: query.length >= 2 ? 'pointer' : 'not-allowed',
            backgroundColor: query.length >= 2 ? '#4a90e2' : '#e0e0e0',
            color: query.length >= 2 ? 'white' : '#999'
          }}
        >
          Search
        </button>

        <div style={{ position: 'relative' }} ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#4a90e2',
              color: 'white'
            }}
          >
            Filters
          </button>
          
          {isFilterOpen && (
            <div style={{
              position: 'absolute',
              right: '0',
              marginTop: '4px',
              width: '256px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: '20',
              padding: '16px'
            }}>
              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType} style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontWeight: '500', 
                    marginBottom: '8px',
                    textTransform: 'capitalize'
                  }}>{filterType}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleFilterChange(filterType, option.toLowerCase().replace(' ', '-'))}
                        style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '999px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: filters[filterType] === option.toLowerCase().replace(' ', '-') 
                            ? '#4a90e2' 
                            : '#f0f0f0',
                          color: filters[filterType] === option.toLowerCase().replace(' ', '-') 
                            ? 'white' 
                            : 'inherit'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setFilters({
                  cuisine: '',
                  diet: '',
                  intolerances: '',
                  type: ''
                })}
                style={{
                  fontSize: '14px',
                  color: '#4a90e2',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '8px',
                  padding: '0'
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {Object.values(filters).some(Boolean) && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {Object.entries(filters).map(([filterType, value]) => {
            if (!value) return null;
            const displayValue = value.replace('-', ' ');
            return (
              <span 
                key={`${filterType}-${value}`} 
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{filterType}:</span>
                <span>{displayValue}</span>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, [filterType]: '' }))}
                  style={{
                    color: '#666',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    fontSize: '16px',
                    lineHeight: '1'
                  }}
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