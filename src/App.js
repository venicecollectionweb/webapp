import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToOh-0WvSZ74tQAlYK80kx_77O3OdSjkN8sZticg6XnLDF4LKsoZyumOfzwPg78NNB2ls3EQCF3l-c/pub?output=csv";
  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (result) => {
        setProducts(result.data);
      },
    });
  }, []);

  const filteredProducts = products.filter((product) => {
    const isCategoryMatch =
      selectedCategory === "All" || product.Category === selectedCategory;
    const isSubcategoryMatch =
      selectedSubcategory === "All" || product.Subcategory === selectedSubcategory;

    return isCategoryMatch && isSubcategoryMatch;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Venice Collection</h1>
        <p>Browse our amazing products</p>
        <nav className="category-nav">
          <button onClick={() => setSelectedCategory("All")} className="category-btn">Home</button>
          <button onClick={() => setSelectedCategory("Uomini")} className="category-btn">Uomini</button>
          <button onClick={() => setSelectedCategory("Donne")} className="category-btn">Donne</button>
          <button onClick={() => setSelectedCategory("Bambini")} className="category-btn">Bambini</button>
          <button onClick={() => setSelectedCategory("Neonati")} className="category-btn">Neonati</button>
        </nav>

        {selectedCategory !== "All" && (
          <nav className="subcategory-nav">
            <button onClick={() => setSelectedSubcategory("All")} className="subcategory-btn">All Subcategories</button>
            {Array.from(new Set(products.filter(p => p.Category === selectedCategory).map(p => p.Subcategory)))
              .map(subcategory => (
                <button
                  key={subcategory}
                  onClick={() => setSelectedSubcategory(subcategory)}
                  className="subcategory-btn"
                >
                  {subcategory}
                </button>
              ))}
          </nav>
        )}
      </header>

      <div className="product-grid">
        {filteredProducts.map((product, idx) => (
          <ProductCard
            key={idx}
            name={product["Product Name"]}
            image={product["Image Path"]}
            colors={product["Colors Available"]}
            sizes={product["Sizes Available"]}
            stampe={product["Stampe"]}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
