import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  getSeearchProducts,
  resetSearchresult,
} from "../../../store/shop/searchSlice";
import ShoppingProductTile from "@/components/shoppingView/ShoppingProductTile";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 1) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSeearchProducts(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchresult());
    }
  }, [keyword]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8 ">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products"
          />
        </div>
      </div>
      {searchResults && searchResults.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((result) => (
            <ShoppingProductTile key={result.id} product={result} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <h1 className="text-4xl font-extrabold">
            {searchResults === "" ? "Search Something" : "No Product Found"}
          </h1>
        </div>
      )}
    </div>
  );
}

export default Search;
