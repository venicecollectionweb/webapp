import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import Papa from "papaparse";
import "./App.css";
import "./Model.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vToOh-0WvSZ74tQAlYK80kx_77O3OdSjkN8sZticg6XnLDF4LKsoZyumOfzwPg78NNB2ls3EQCF3l-c/pub?output=csv";

    useEffect(() => {
      if (isModalOpen && selectedProduct) {
        console.log("Rendering modal for:", selectedProduct);
      }
    }, [isModalOpen, selectedProduct]);
      
  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (result) => {
        // Parse the CSV and handle images
        const parsedData = result.data.map((product) => {
          // Check if images are available and split them correctly
          const images = product.Images
            ? product.Images.split(",").map((image) => image.trim())
            : [];

          return {
            ...product,
            images,  // Add images array to product
          };
        });


        setProducts(parsedData);  // Set the parsed data into state
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

  const openModal = (product) => {
    console.log("Selected product:", product.images[0]);
    // Ensure that images are available before opening the modal
    if (product.images && product.images.length > 0) {
      setSelectedProduct({
        ...product,
        currentImage: product.images[0], // Initialize the first image for the carousel
      });
      setIsModalOpen(true);
      document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
    } else {
      console.error("No images available for this product:", product["Product ID"]); // Log error if no images
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = "auto"; // Enable scrolling again when modal is closed
  };

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
        {filteredProducts.map((product, idx) => {
          const productID = product["Product ID"];
          const imagePath = `/webapp/images/${productID}/main_image.webp`;

          return (
            <div
              key={idx}
              className="product-card"
              onClick={() => openModal(product)} // Open modal on click
            >
              <img alt={product["Product ID"]} src={imagePath} />
              <h3>{product["Product ID"]}</h3>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedProduct && (
  <div className="modal-overlay active">
    <div className="modal active">
      <button className="close-btn" onClick={closeModal}>X</button>
      <div className="modal-inner">
        {/* Left card with Image Carousel */}
        <div className="modal-card left-card">
          <div className="image-carousel">
            {selectedProduct.images?.map((image, index) => (
              <img
                key={index}
                src={`/webapp/images/${selectedProduct["Product ID"]}/${image}`}
                alt={`${selectedProduct["Product ID"]} image ${index + 1}`}
                className="carousel-image"
              />
            ))}
          </div>
        </div>

              {/* Right card with Product Details */}
              <div className="modal-card right-card">
                <div className="product-info">
                  <h2>{selectedProduct["Product ID"]}</h2>

                  <h3>Sizes</h3>
                  <ul>
                    {selectedProduct["Sizes Available"]?.split(",").map((size, index) => (
                      <li key={index}>{size.trim()}</li>
                    ))}
                  </ul>

                  <h3>Colors</h3>
                  <ul>
                    {selectedProduct["Colors Available"]?.split(",").map((color, index) => (
                      <li key={index}>{color.trim()}</li>
                    ))}
                  </ul>

                  <h3>Stampe</h3>
                  <ul>
                    {selectedProduct["Stampe"]?.split(",").map((stampa, index) => (
                      <li key={index}>{stampa.trim()}</li>
                    ))}
                  </ul>
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
