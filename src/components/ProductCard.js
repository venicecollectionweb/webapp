import React from "react";
import "./ProductCard.css";  // Import the styling for the product card

function ProductCard({ name, image, colors, sizes, stampe }) {
    return (
      <div className="product-card">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>Colors: {colors}</p>
        <p>Sizes: {sizes}</p>
        {stampe && <p>Stampe: {stampe}</p>}
      </div>
    );
  }
  

export default ProductCard;
