// app/RecipeDetail/[id]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { getFavorites, addToFavorites, removeFromFavorites, isFavorite } from '@/utils/favorites';

export default function RecipeDetail({ params }) {
  const { id } = params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=3bd7a4f8ff344dc1a1fce81eea2fe72a`
        );
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const data = await res.json();
        setRecipe(data);
        setFavoriteStatus(isFavorite(data.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  const toggleFavorite = () => {
    if (favoriteStatus) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
    setFavoriteStatus(!favoriteStatus);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  if (error) return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Recipe Not Found</h2>
      <p>We couldn't find the recipe you're looking for.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
          {recipe.title}
        </h1>
        <button
          onClick={toggleFavorite}
          style={{
            padding: '8px 16px',
            backgroundColor: favoriteStatus ? '#ff4d4d' : '#f0f0f0',
            color: favoriteStatus ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {favoriteStatus ? (
            <>
              <span>❤️</span> Remove from Favorites
            </>
          ) : (
            <>
              <span>🤍</span> Add to Favorites
            </>
          )}
        </button>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Ingredients
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id} style={{ marginBottom: "8px" }}>
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            Instructions
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: recipe.instructions || "No instructions provided.",
            }}
            style={{ lineHeight: "1.6" }}
          />
        </div>
      </div>
    </div>
  );
}