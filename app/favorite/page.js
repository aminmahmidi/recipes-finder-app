// app/favorites/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavorites } from "@/utils/favorites";
import style from "./favorite.module.css";
import Image from "next/image";
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  return (
    <div>
      <h1 className={style.title}>Favorites</h1>
      <div className={style.favoritesContainer}>
        {favorites.length === 0 ? (
          <div>
            <p>You haven't added any recipes to your favorites yet.</p>
            <Link href="/">Browse recipes</Link>
          </div>
        ) : (
          <div>              <h1 className={style.insideTitle}>
          Your Favorite Recipes
        </h1>
          <div className={style.FavoriteRecipeContainer}>
            {favorites.map((recipe) => (
              <div className={style.recipeCard} key={recipe.id}>
                <Link href={`/recipes/${recipe.id}`}>
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    className={style.recipeImg}
                    width={300}
                    height={200}
                  />
                  <div>
                    <h3 className={style.recipeTitle}>{recipe.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
