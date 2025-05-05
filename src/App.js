import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";
import "./Model.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToOh-0WvSZ74tQAlYK80kx_77O3OdSjkN8sZticg6XnLDF4LKsoZyumOfzwPg78NNB2ls3EQCF3l-c/pub?output=csv";
  
  const colorMap = {
    Rosso: "#FF0000",      // Red
    "Blu Navy": "#003366", // Navy Blue
    Bordeaux: "#800000",   // Bordeaux Red
    Bianco: "#FFFFFF",     // White
    Royal: "#4169E1",      // Royal Blue
    Grigio: "#808080",     // Gray
    Nero: "#000000",       // Black
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedProduct.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedProduct.images.length - 1 ? 0 : prevIndex + 1
    );
  };  

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (result) => {
        const parsedData = result.data.map((product) => {
          const images = product.Images
            ? product.Images.split(",").map((image) => image.trim())
            : [];
          return { ...product, images };
        });
        setProducts(parsedData);
      },
    });
  }, []);

  const categories = ["Uomini", "Donne", "Bambini", "Neonati", "Personalizzate"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
    setIsDropdownOpen((prev) => (prev === category ? null : category));
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDropdownOpen(null);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "All" || product.Category === selectedCategory;
    const matchSubcategory =
      selectedSubcategory === "All" || product.Subcategory === selectedSubcategory;
    return matchCategory && matchSubcategory;
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Venice Collection</h1>
        <p>Browse our amazing products</p>

        <nav className="category-dropdown-nav">
          <button
            className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => {
              setSelectedCategory("All");
              setSelectedSubcategory("All");
              setIsDropdownOpen(null);
            }}
          >
            Home
          </button>

          {categories.map((cat) => {
            const subcategories = Array.from(
              new Set(products.filter((p) => p.Category === cat).map((p) => p.Subcategory))
            );

            return (
              <div key={cat} className="category-dropdown-wrapper">
                <button
                  onClick={() => handleCategorySelect(cat)}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                >
                  {cat} ▼
                </button>
                {isDropdownOpen === cat && (
                  <ul className="subcategory-dropdown-menu">
                    
                    {subcategories.map((sub) => (
                      <li key={sub} onClick={() => handleSubcategorySelect(sub)}>
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </header>

      <div className="product-grid">
        {filteredProducts.map((product, idx) => {
          const productID = product["Product ID"];
          const imagePath = `/webapp/images/${productID}/main_image.webp`;
          return (
            <div key={idx} className="product-card" onClick={() => openModal(product)}>
              <img src={imagePath} alt={product["Product ID"]} />
              <h3>{product["Product ID"]}</h3>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
            <div className="modal-content">
              <div className="modal-left">
                <button className="carousel-btn left" onClick={handlePrev}>‹</button>
                <img
                  src={`/webapp/images/${selectedProduct["Product ID"]}/${selectedProduct.images[currentImageIndex]}`}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="product-image"
                />
                <button className="carousel-btn right" onClick={handleNext}>›</button>
              </div>
              <div className="modal-right">
                <h2>{selectedProduct["Product ID"]}</h2>

                <h3>Sizes</h3>
                <div className="tag-list">
                  {selectedProduct["Sizes Available"]?.split(",").map((size, idx) => (
                    <div key={idx} className="tag">{size.trim()}</div>
                  ))}
                </div>

                <h3>Colors</h3>
                <div className="color-list">
                  {selectedProduct["Colors Available"]?.split(",").map((color, idx) => {
                    const trimmedColor = color.trim();
                    const colorHex = colorMap[trimmedColor] || "#ccc";  // Default to grey if not found in map

                    return (
                      <div key={idx} className="color-item">
                        <span className="color-dot" style={{ backgroundColor: colorHex }}></span>
                        {trimmedColor}
                      </div>
                    );
                  })}
                </div>

                <h3>Stampe</h3>
                <div className="tag-list">
                  {selectedProduct["Stampe"]?.split(",").map((stampa, idx) => (
                    <div key={idx} className="tag">{stampa.trim()}</div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
