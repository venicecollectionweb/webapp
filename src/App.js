import React from "react";
import ProductCard from "./components/ProductCard";
import "./App.css";
import products from "./data/products.json";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Our Products</h1>
      <div className="product-grid">
        {products.map((prod, index) => (
          <ProductCard
            key={index}
            name={prod.name}
            image={prod.image}
            colors={prod.colors}
            sizes={prod.sizes}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
