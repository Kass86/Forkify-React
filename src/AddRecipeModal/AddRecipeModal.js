import React, { useContext, useEffect, useState } from "react";
import { selectedContext } from "../App/App";
import { IoCloudUploadOutline, IoRestaurantOutline } from "react-icons/io5";

export const AddRecipeModal = () => {
  const {
    openModal,
    setOpenModal,
    setRecipeCreated,
    beginSpinner,
    stopSpinner,
    spinner,
  } = useContext(selectedContext);

  const [dataForm, setDataForm] = useState([]);
  const [newRecipe, setNewRecipe] = useState();
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(false);

  const resetForm = () => {
    document.querySelector(".upload")?.reset();
  };

  useEffect(() => {
    const ingredients = dataForm
      .filter((ing) => {
        return ing[0].startsWith("ingredient") && ing[1] !== "";
      })
      .map((ing) => {
        const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3) {
          setError(true);
        } else {
          setError(false);
          const [quantity, unit, description] = ingArr;
          return { quantity: quantity ? +quantity : null, unit, description };
        }
      });
    if (dataForm.length) {
      const objDataForm = Object.fromEntries(dataForm);
      const newRec = {
        title: objDataForm.title,
        source_url: objDataForm.sourceUrl,
        image_url: objDataForm.image,
        publisher: objDataForm.publisher,
        cooking_time: +objDataForm.cookingTime,
        servings: +objDataForm.servings,
        ingredients,
      };

      setNewRecipe(newRec);
    }
  }, [dataForm]);

  useEffect(() => {
    if (error === false && newRecipe) {
      beginSpinner("modal");
      fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?&key=cbc2d4f0-4cd9-4886-90b8-2743d93b88b8
        `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecipe),
        }
      ).then((res) =>
        res.json().then((re) => {
          console.log(re);
          stopSpinner("modal");
          setUploaded(true);

          setRecipeCreated(re.data.recipe);
        })
      );
    }
  }, [error, newRecipe, setRecipeCreated]);

  useEffect(() => {
    if (openModal === false) {
      resetForm();
      setNewRecipe(undefined);
      setTimeout(() => {
        setUploaded(false);
        setError(false);
      }, 600);
    }
  }, [openModal]);

  return (
    <>
      <div className={`overlay ${!openModal ? "hidden" : ""}`}></div>
      <div className={`add-recipe-window ${!openModal ? "hidden" : ""}`}>
        <button
          onClick={() => {
            setOpenModal((prev) => {
              return !prev;
            });
          }}
          className="btn--close-modal"
        >
          &times;
        </button>

        {spinner.modal ? (
          <div className="spinner">
            <IoRestaurantOutline />
          </div>
        ) : uploaded ? (
          <div className="error">
            <p>Your recipe is uploaded</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const dataArr = [...new FormData(e.target)];
              setDataForm(dataArr);
            }}
            className="upload"
          >
            <div className="upload__column">
              <h3 className="upload__heading">Recipe data</h3>
              <label>Title</label>
              <input required name="title" type="text" />
              <label>URL</label>
              <input required name="sourceUrl" type="text" />
              <label>Image URL</label>
              <input required name="image" type="text" />
              <label>Publisher</label>
              <input required name="publisher" type="text" />
              <label>Prep time</label>
              <input required name="cookingTime" type="number" />
              <label>Servings</label>
              <input required name="servings" type="number" />
            </div>

            <div className="upload__column">
              <h3 className="upload__heading">Ingredients</h3>
              <label>Ingredient 1</label>
              <input
                type="text"
                required
                name="ingredient-1"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
              <label>Ingredient 2</label>
              <input
                type="text"
                name="ingredient-2"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
              <label>Ingredient 3</label>
              <input
                type="text"
                name="ingredient-3"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
              <label>Ingredient 4</label>
              <input
                type="text"
                name="ingredient-4"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
              <label>Ingredient 5</label>
              <input
                type="text"
                name="ingredient-5"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
              <label>Ingredient 6</label>
              <input
                type="text"
                name="ingredient-6"
                placeholder="Format: 'Quantity,Unit,Description'"
              />
            </div>
            {error ? (
              <div className="message">
                <p>Wrong ingredient format! Please use the correct format.</p>
              </div>
            ) : (
              ""
            )}

            <button className="btn upload__btn">
              <IoCloudUploadOutline />
              <span>Upload</span>
            </button>
          </form>
        )}
      </div>
    </>
  );
};
