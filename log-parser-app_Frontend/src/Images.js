import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/images_grid.css';  // Importing the CSS file for grid layout

const Images = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/images')
      .then((response) => {
        setImages(response.data.images); // Setting the images list from backend
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (error) {
    return <div>Error loading images: {error.message}</div>;
  }

  return (
    <div className="imagesContainer">
      <h2>Decoded Images</h2>
      <div className="imagesGrid">
        {images.map((image, index) => (
          <div key={index} className="imageItem">
            <img
              src={`http://127.0.0.1:5000/api/images/${image}`}
              alt={image}
              className="image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
