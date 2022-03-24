import React, { useEffect, useState, useContext } from "react";
import { Bookmark } from "../Bookmark/Bookmark";
import { selectedContext } from "../App/App";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

export const Header = () => {
  const { setPage, setResults, setOpenModal, beginSpinner, stopSpinner } =
    useContext(selectedContext);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    //remember to catch the err
    if (!searchValue) return;

    fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/?search=${searchValue}&key=cbc2d4f0-4cd9-4886-90b8-2743d93b88b8
      `
    ).then((res) =>
      res.json().then((re) => {
        // console.log(re);
        stopSpinner("search");
        setSearchValue("");
        if (re.status === "fail") throw new Error(`${re.message}`);
        setResults(re);
      })
    );

    setSearch(""); // clear search
  }, [searchValue, setResults]);

  return (
    <header className="header">
      <img src="../img/logo.png" alt="Logo" className="header__logo" />
      <form className="search">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          type="text"
          className="search__field"
          placeholder="Search over 1,000,000 recipes..."
        />
        <button
          onClick={(e) => {
            // idk but its need a prevent default if not => error
            e.preventDefault();
            setSearchValue(search);
            setSearch("");
            setPage(1);
            beginSpinner("search");
          }}
          className="btn search__btn"
        >
          <IoSearchOutline />
          <span>Search</span>
        </button>
      </form>

      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <button
              onClick={() =>
                setOpenModal((prev) => {
                  return !prev;
                })
              }
              className="nav__btn nav__btn--add-recipe"
            >
              <IoAddCircleOutline />
              <span>Add recipe</span>
            </button>
          </li>
          <Bookmark />
        </ul>
      </nav>
    </header>
  );
};
