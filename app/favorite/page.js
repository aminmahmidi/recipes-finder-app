// app/favorites/page.jsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFavorites } from '@/utils/favorites';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "30px" }}>Your Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>You haven't added any recipes to your favorites yet.</p>
          <Link href="/" style={{ color: "#0070f3", textDecoration: "none" }}>
            Browse recipes
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {favorites.map((recipe) => (
            <div key={recipe.id} style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
              <Link href={`/RecipeDetail/${recipe.id}`}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>{recipe.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}