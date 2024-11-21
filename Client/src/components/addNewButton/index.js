import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton } from "@chakra-ui/react";
import exercises from '../exercises/index.js'; 

const FloatingButton = ({ name, buttonData }) => {
  const [show, setShow] = useState(false);
  const [buttons, setButtons] = useState([]);
  const containerRef = useRef(null);

  const fetchButtonData = async (name) => {
    try {
      setButtons(exercises[name]);
    } catch (error) {
      console.error('Error fetching button data:', error);
    }
  };

  const toggleDropdown = () => {
    setShow((prev) => !prev);
    if (!show) {
      fetchButtonData(name); // Fetch data when opening dropdown
    }
  };

  const navigate = useNavigate();

  const handleClick = (exercise) => {
    const queryString = new URLSearchParams({ data: JSON.stringify(buttonData) }).toString();
    navigate(`/routine/${name}/add/${exercise}/?${queryString}`); 
  }

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("touchstart", handleClickOutside); // Add touch support

    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <Box ref={containerRef} position="fixed" bottom="20px" right="20px" zIndex="1000">
      <IconButton
        aria-label="Add exercise"
        backgroundColor={show ? '#bdcee6' : "#282c34"}
        color={show ? '#394f6d' : "white"}
        borderRadius="2rem"
        padding='6'
        marginBottom='0.75rem'
        marginRight='0.5rem'
        width="fit-content"
        height="3rem"
        boxShadow={show ? "inset 0.2rem 0.4rem 0.6rem rgba(0, 0, 0, 0.35)" : null }
        sx={{
          _hover: {
            transform: "none", // Remove any transform (scale or movement)
          },
        }}
        onClick={toggleDropdown}
        icon={<span>Add Exercise</span>} // You can replace this with an icon component if you want
      >
      </IconButton>
      {show && (
        <Box position="fixed" bottom="100px" right="20px" display="flex" flexDirection="column" alignItems="center">
          {buttons.map((exercise, index) => (
            <Button
              key={index}
              backgroundColor="white"
              margin="10px"
              padding="15px 30px"
              borderRadius="5px"
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
              onClick={() => handleClick(exercise)}
            >
              {exercise}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FloatingButton;
