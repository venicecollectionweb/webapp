import React from "react";
import "./ProductCard.css"; // Import the CSS file

const ProductCard = ({ name, image, colors, sizes }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-label">
        <strong>Colors:</strong> {colors}
      </p>
      <p className="product-label">
        <strong>Sizes:</strong> {sizes}
      </p>
    </div>
  );
};

export default ProductCard;
