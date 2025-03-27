
export const getFavorites = () => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    return [];
  };
  
  export const addToFavorites = (recipe) => {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };
  
  export const removeFromFavorites = (recipeId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };
  
  export const isFavorite = (recipeId) => {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === recipeId);
  };