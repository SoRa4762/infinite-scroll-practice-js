import React, { useState, useRef, useCallback } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type="text" value={query} onChange={handleChange} />
      {/* {console.log(books)} */}
      {books.map((book, key) => {
        // console.log(book);
        return (
          <div ref={lastBookElementRef} key={key}>
            {book}
          </div>
        );
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error..."}</div>
    </>
  );
}

export default App;
