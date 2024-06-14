import React, { useState, useEffect } from "react";
import StockContainer from "./StockContainer";
import PortfolioContainer from "./PortfolioContainer";
import SearchBar from "./SearchBar";

function MainContainer() {
  const [portfolio, setPortfolio] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3001/stocks")
      .then((response) => response.json())
      .then((data) => {
        setStocks(data);
        setFilteredStocks(data);
      });
  }, []);

  useEffect(() => {
    let updatedStocks = [...stocks];

    if (filterType !== "All") {
      updatedStocks = updatedStocks.filter((stock) => stock.type === filterType);
    }

    if (sortType === "Alphabetically") {
      updatedStocks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "Price") {
      updatedStocks.sort((a, b) => a.price - b.price);
    }

    setFilteredStocks(updatedStocks);
  }, [sortType, filterType, stocks]);

  const handleBuyStock = (stock) => {
    if (!portfolio.find((s) => s.id === stock.id)) {
      setPortfolio([...portfolio, stock]);
    }
  };

  const handleSellStock = (stock) => {
    setPortfolio(portfolio.filter((s) => s.id !== stock.id));
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div>
      <SearchBar handleSortChange={handleSortChange} handleFilterChange={handleFilterChange} />
      <div className="row">
        <div className="col-8">
          <StockContainer stocks={filteredStocks} handleStockClick={handleBuyStock} />
        </div>
        <div className="col-4">
          <PortfolioContainer portfolio={portfolio} handleStockClick={handleSellStock} />
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
