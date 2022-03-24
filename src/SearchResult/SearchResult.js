import React, { useEffect, useState, useContext } from "react";
import { Result } from "../Result/Result";
import { selectedContext } from "../App/App";
import { IoRestaurantOutline } from "react-icons/io5";

export const SearchResult = ({ res }) => {
  const { page, setPage, spinner } = useContext(selectedContext);
  const [newRes, setNewRes] = useState([]);
  let numPage;

  if (res) {
    // Check total pages ( 10result/page)
    numPage = Math.floor(1 + res.data.recipes.length / 10);
  }

  useEffect(() => {
    // Create a new Results that contain 10 result depend on "page"
    if (res) {
      const start = (page - 1) * 10;
      const end = page * 10;
      setNewRes(res.data.recipes.slice(start, end));
    }
  }, [res, page]);

  return (
    <div className="search-results">
      {res?.results === 0 && (
        <div className="error">
          <p>No recipes found for your query! Please try another one!</p>
        </div>
      )}

      {spinner.search ? (
        <div className="spinner">
          <IoRestaurantOutline />
        </div>
      ) : (
        <ul className="results">
          {newRes ? (
            newRes.map((rec, i) => <Result key={i} data={rec} />)
          ) : (
            <></>
          )}
        </ul>
      )}

      {/* May be write it to component <pag /> receive {page,setpage,numpage}*/}
      <div className="pagination">
        {page !== 1 ? (
          <button
            onClick={() => setPage((prev) => prev - 1)}
            className="btn--inline pagination__btn--prev"
          >
            <svg className="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>{`Page ${page - 1}`}</span>
          </button>
        ) : (
          ""
        )}
        {page !== numPage && numPage ? (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="btn--inline pagination__btn--next"
          >
            <span>{`Page ${page + 1}`}</span>
            <svg className="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
        ) : (
          ""
        )}
      </div>

      <p className="copyright">
        &copy; Copyright by
        <a
          rel="noreferrer"
          className="twitter-link"
          target="_blank"
          href="https://twitter.com/jonasschmedtman"
        >
          Jonas Schmedtmann
        </a>
        . Use for learning or your portfolio.
      </p>
    </div>
  );
};
