import React from "react";

const SearchBar = ({handleSearch, searchQuery}) => {
  return (
    <form className="content-sidebar-form" >
      <input
        type="search"
        className="content-sidebar-input"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search..."
      />
      <button type="submit" className="content-sidebar-submit" onClick={(e)=>{
        e.preventDefault()
      }}>
        <i className="fa fa-search" />
      </button>
    </form>
  );
};

export default SearchBar;
