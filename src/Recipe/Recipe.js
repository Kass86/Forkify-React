import React, { useContext, useEffect, useState } from "react";
import { selectedContext } from "../App/App";
import {
  IoBookmark,
  IoTimerOutline,
  IoPeopleOutline,
  IoBookmarkOutline,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
  IoPerson,
  IoCheckmarkOutline,
  IoRestaurantOutline,
} from "react-icons/io5";

export const Recipe = () => {
  const {
    selected,
    setSelected,
    bookmarked,
    setBookmarked,
    beginSpinner,
    stopSpinner,
    spinner,
  } = useContext(selectedContext);
  const [recipe, setRecipe] = useState();
  const [serving, setServing] = useState("");
  const id = window.location.hash.slice(1);

  //check id recipe if it exist in bookmarked
  const check = bookmarked?.some((marked) => marked.recipe.id === id);

  // check if customer find this page with id in the href, if yes, render recipe of that id
  useEffect(() => {
    if (!selected) setSelected(id);
  }, [selected, setSelected, id]);

  useEffect(() => {
    // add bookmark to local
    localStorage.setItem("bookmarked", JSON.stringify(bookmarked));
  }, [bookmarked]);

  useEffect(() => {
    if (!selected) return;
    beginSpinner("recipe");
    document.location.href = `/#${selected}`;
    fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${selected}?key=cbc2d4f0-4cd9-4886-90b8-2743d93b88b8
      `
    ).then((res) =>
      res.json().then((re) => {
        stopSpinner("recipe");
        setRecipe(re.data.recipe);
        console.log(re.data.recipe);
        //may not use usestate serving by use recipe.servings and setRecipe((prev)=> [...prev, servings: prev.servings + 1])
        setServing(re.data.recipe.servings);
      })
    );
  }, [selected]);

  return (
    <div className="recipe">
      {spinner.recipe ? (
        <div className="spinner">
          <IoRestaurantOutline />
        </div>
      ) : !recipe ? (
        <div className="message">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-smile"></use>
            </svg>
          </div>
          <p>Start by searching for a recipe or an ingredient. Have fun!</p>
        </div>
      ) : (
        <>
          <figure className="recipe__fig">
            <img src={recipe.image_url} alt="Tomato" className="recipe__img" />
            <h1 className="recipe__title">
              <span>{recipe.title}</span>
            </h1>
          </figure>

          <div className="recipe__details">
            <div className="recipe__info">
              <IoTimerOutline className="recipe__info-icon" />
              <span className="recipe__info-data recipe__info-data--minutes">
                {recipe.cooking_time}
              </span>
              <span className="recipe__info-text">minutes</span>
            </div>
            <div className="recipe__info">
              <IoPeopleOutline className="recipe__info-icon" />
              <span className="recipe__info-data recipe__info-data--people">
                {serving}
              </span>
              <span className="recipe__info-text">servings</span>

              <div className="recipe__info-buttons">
                <button
                  onClick={() => setServing(serving + 1)}
                  className="btn--tiny btn--increase-servings"
                >
                  <IoAddCircleOutline className="recipe__info-icon" />
                </button>
                <button
                  onClick={() => serving !== 1 && setServing(serving - 1)}
                  className="btn--tiny btn--increase-servings"
                >
                  <IoRemoveCircleOutline className="recipe__info-icon" />
                </button>
              </div>
            </div>

            <div
              className={`recipe__user-generated ${recipe.key ? "" : "hidden"}`}
            >
              <IoPerson />
            </div>
            <button
              onClick={() => {
                // ADD and REmove bookmark
                if (!check) {
                  setBookmarked((prev) => {
                    return [...prev, { recipe, id: recipe.id }];
                  });
                } else {
                  setBookmarked((prev) => {
                    return prev.filter((pre) => pre.id !== id);
                  });
                }
              }}
              className="btn--round"
            >
              {check ? (
                <IoBookmark className="recipe__info-icon__bookmark"></IoBookmark>
              ) : (
                <IoBookmarkOutline className="recipe__info-icon__bookmark" />
              )}
            </button>
          </div>
          <div className="recipe__ingredients">
            <h2 className="heading--2">Recipe ingredients</h2>
            <ul className="recipe__ingredient-list">
              {recipe.ingredients.map((ing, i) => {
                return (
                  <li className="recipe__ingredient" key={i}>
                    <IoCheckmarkOutline className="recipe__icon" />
                    <div className="recipe__quantity">
                      {ing.quantity
                        ? (ing.quantity * serving) / recipe.servings
                        : ""}
                    </div>
                    <div className="recipe__description">
                      <span className="recipe__unit"> {ing.unit}</span>{" "}
                      {ing.description}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="recipe__directions">
            <h2 className="heading--2">How to cook it</h2>
            <p className="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span className="recipe__publisher"> {recipe.publisher}</span>.
              Please check out directions at their website.
            </p>
            <a
              className="btn--small recipe__btn"
              href={recipe.source_url}
              target="_blank"
              rel="noreferrer"
            >
              <span>Directions</span>
              <svg className="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
              </svg>
            </a>
          </div>
        </>
      )}
    </div>
  );
};
