import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./PetCategory.css";

const petCategories = [
  {
    name: "Dogs",
    type: "Mishri Puppy",
    image: "/images/dog.png",
    bgColor: "#fbcfe8",
    pulseColor: "#f9a8d4",
    filterValue: "Dog"
  },
  {
    name: "Cats",
    type: "Racing Cat",
    image: "/images/cat.png",
    bgColor: "#fef08a",
    pulseColor: "#fde047",
    filterValue: "Cat"
  },
  {
    name: "Rabbits",
    type: "Fluffy Bunny",
    image: "/images/rabbit.png",
    bgColor: "#bbf7d0",
    pulseColor: "#86efac",
    filterValue: "Rabbit"
  },
  {
    name: "Birds",
    type: "Singing Parrot",
    image: "/images/bird.png",
    bgColor: "#c7d2fe",
    pulseColor: "#a5b4fc",
    filterValue: "Bird"
  },
];

const PetCategory = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };


   
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 150
      }
    })
  };

  const handleCategoryClick = (specie) => {
    navigate('/petlist', { state: { initialFilter: specie } });
  };


    return (
    <motion.div 
      className="category-containerr"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="category-container">
        {/* Title Section */}
        <motion.div variants={itemVariants}>
          <h2 className="category-title">Discover Our Pet Categories</h2>
        </motion.div>
        
        <motion.p 
          className="category-description"
          variants={itemVariants}
        >
          Find your perfect companion from our diverse selection of adorable pets.
        </motion.p>
        
        {/* Category Cards */}
        <motion.div 
          className="category-cards"
          variants={containerVariants}
        >
          {petCategories.map((pet, index) => (
            <motion.div
              key={index}
              className="category-card"
              onClick={() => handleCategoryClick(pet.filterValue)}
              style={{ cursor: 'pointer' }}
              variants={cardVariants}
              custom={index}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="category-image-container pulse-animation"
                style={{ 
                  backgroundColor: pet.bgColor,
                  boxShadow: `0 0 0 0 ${pet.pulseColor}`
                }}
              >
                <motion.img 
                  src={pet.image} 
                  alt={pet.name} 
                  className="category-image float-animation" 
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                />
              </div>
              <h3 className="category-name">{pet.name}</h3>
              <p className="category-type">{pet.type}</p>
              <div className="category-dots">
                {[...Array(3)].map((_, i) => (
                  <motion.span 
                    key={i} 
                    className="dot" 
                    style={{ backgroundColor: pet.bgColor }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.15 + i * 0.1 + 0.4
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cloud Image */}
        <motion.div 
          className="cat-cloud-container"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <img 
            src="/images/clouds2.png" 
            alt="Cat Cloud" 
            className="cloud-image"
          />
        </motion.div>
      </div>
    </motion.div>
  );

};

export default PetCategory;