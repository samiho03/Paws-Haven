import React from "react";
import { FaPaw } from "react-icons/fa";
import "./PetCategory.css";

const petCategories = [
  {
    name: "Dogs",
    type: "Mishri Puppy",
    image: "/images/dog.png",
    bgColor: "#fbcfe8",
    pulseColor: "#f9a8d4"
  },
  {
    name: "Cats",
    type: "Racing Cat",
    image: "/images/cat.png",
    bgColor: "#fef08a",
    pulseColor: "#fde047"
  },
  {
    name: "Rabbits",
    type: "Fluffy Bunny",
    image: "/images/rabbit.png",
    bgColor: "#bbf7d0",
    pulseColor: "#86efac"
  },
  {
    name: "Birds",
    type: "Singing Parrot",
    image: "/images/bird.png",
    bgColor: "#c7d2fe",
    pulseColor: "#a5b4fc"
  },
];

const PetCategory = () => {
  return (
    <div className="category-container">
       <div className="paw-prints-background">
        {[...Array(15)].map((_, i) => (
          <FaPaw 
            key={i}
            className="floating-paw"
            style={{
              left: `${Math.random() * 100 + 5}%`,
              top: `${Math.random() * 100 + 5}%`,
              animationDelay: `${i * 0.2}s`,
              fontSize: `${Math.random() * 1.7 + 1}rem`,
              opacity: Math.random() * 0.3 + 0.1,
              
            }}
          />
        ))}
      </div>

      <h2 className="category-title">Discover Our Pet Categories</h2>
      <p className="category-description">
        Find your perfect companion from our diverse selection of adorable pets.
      </p>
      <div className="category-cards">
        {petCategories.map((pet, index) => (
          <div className="category-card" key={index}>
            <div
              className="category-image-container pulse-animation"
              style={{ 
                backgroundColor: pet.bgColor,
                boxShadow: `0 0 0 0 ${pet.pulseColor}`
              }}
            >
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="category-image float-animation" 
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </div>
            <h3 className="category-name">{pet.name}</h3>
            <p className="category-type">{pet.type}</p>
            <div className="category-dots">
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i} 
                  className="dot" 
                  style={{ 
                    backgroundColor: pet.bgColor,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetCategory;