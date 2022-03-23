import React, { useEffect, useState, createContext } from "react";
import { AddRecipeModal } from "../AddRecipeModal/AddRecipeModal";
import { Header } from "../Header/Header";
import { Recipe } from "../Recipe/Recipe";
import { SearchResult } from "../SearchResult/SearchResult";

export const selectedContext = createContext();
export const App = () => {
  // const [data, setData] = useState("");
  const [results, setResults] = useState();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState();
  const [bookmarked, setBookmarked] = useState(
    localStorage.getItem("bookmarked")
      ? JSON.parse(localStorage.getItem("bookmarked"))
      : []
  );
  const [openModal, setOpenModal] = useState(false);
  const [recipeCreated, setRecipeCreated] = useState();

  const value = {
    selected,
    setSelected,
    page,
    setPage,
    results,
    setResults,
    bookmarked,
    setBookmarked,
    openModal,
    setOpenModal,
    recipeCreated,
    setRecipeCreated,
  };

  useEffect(() => {
    if (!recipeCreated) return;
    setBookmarked((prev) => [
      ...prev,
      { recipe: recipeCreated, id: recipeCreated.id },
    ]);
    setSelected(recipeCreated.id);
    setTimeout(() => {
      setOpenModal((prev) => {
        return !prev;
      });
    }, 800);
  }, [recipeCreated]);

  return (
    <selectedContext.Provider value={value}>
      <div className="container">
        <Header />
        <SearchResult res={results} />
        <Recipe />
        <AddRecipeModal />
      </div>
    </selectedContext.Provider>
  );
};
