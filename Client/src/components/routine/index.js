import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Button, Divider, Text, IconButton, Flex, Image, Input, Spinner } from "@chakra-ui/react";
import { FaArrowLeft, FaSync, FaHistory } from 'react-icons/fa';
import FloatingButton from '../addNewButton/index.js'; 
import { useAuth } from "../../AuthContext";
import SwipeableComponent from '../swipeableComponent/index.js';

function Routine() {

  const location = useLocation();
  const navigate = useNavigate();

  const {user} = useAuth();

  const { name } = useParams();
  const initialData = location.state || null;
  const [buttonData, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleStates, setVisibleStates] = useState([]);
  const [swiped, setSwiped] = useState([]); // Track swipe state

  // Form Submit variables
  const [weight, setWeight] = useState('');  
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = async (e, {item}, {sets}, {weight}, {reps}) => {
    e.preventDefault();

    // Prepare data to send
    const data = {
      'user': user,
      'exercise': item[0],
      'weight': weight,
      'sets': sets,
      'reps': reps
    };

    try {
      const response = await fetch(`http://localhost:3001/routine/${name}/record`, {
      // const response = await fetch(`http://172.20.10.2:3001/routine/${name}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const res = await response.json();
      alert(res.message);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // go back to home page 
  const goHome = () => {
    navigate(`/home`); 
  }

  // toggle completion button on and off
  const handleButtonClick = (index) => {
    setVisibleStates(prevStates =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  // fetch backend data upon load
  const fetchResults = async () => { 
    setLoading(true);
    try {
      // const response = await fetch(`http://172.20.10.2:3001/routine/`+ name);
      const response = await fetch('http://localhost:3001/routine/'+ name);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
    const data = await response.json();
    setData(data);
    setVisibleStates(data.map(value => false));
    setSwiped(data.map(value => false));
    setLoading(false);
    } catch (error) {
        console.log(error)
  }
}

  // fetch backend data upon load
  const getPrev = async () => { 
    setLoading(true);
    try {
      // const response = await fetch(`http://172.20.10.2:3001/getPrev/`+ name);
      const response = await fetch(`http://localhost:3001/getPrev`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user: user })
        });
    //   if (!response.ok) {
    //       alert(response.err);
    //   }
    // const data = await response.json();
    // setData(data);
    // setVisibleStates(data.map(value => false));
    // setSwiped(data.map(value => false));
    // setLoading(false);
    } catch (error) {
        console.log(error)
  }
}

const handleSwipe = (index) => {
  setSwiped(prev => {
    const newSwiped = [...prev];
    newSwiped[index] = !newSwiped[index]; // Toggle swiped state
    return newSwiped;
  });
};

// re-fetch exercise name for exercises where refresh button is clicked
const handleRefresh = async (index, buttonData) => { 
    
  setLoading(true); 

  const queryString = `buttonData=${encodeURIComponent(JSON.stringify(buttonData))}`;

  try {

    const response = await fetch(`http://localhost:3001/routine/${name}/${index}?${queryString}`, {
    // const response = await fetch(`http://172.20.10.2:3001/routine/${name}/${index}?${queryString}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');

    } else {
      const data = await response.json();
      setData(await data);
      setVisibleStates(data.map(value => false));
      setLoading(false);
    };
  } catch (error) {
      console.log(error)
}
}

  useEffect(() => {
;    if (!initialData){
      fetchResults();
    } else{
      setData(initialData);
      setLoading(!loading);
      setVisibleStates(initialData.map(value => false));
    }   
  }, [update]);

const handleSwipeLeft = (index) => {
  setSwiped(prev => {
    const newSwiped = [...prev];
    newSwiped[index] = true; // Set the swiped state to true for the specific index
    return newSwiped;
  });
};

const handleSwipeRight = (index) => {
    setSwiped(prev => {
      const newSwiped = [...prev];
      newSwiped[index] = false; // Set the swiped state to true for the specific index
      return newSwiped;
    });
};

const onDelete = (event, indexRemove) => {

  const updatedData = buttonData.filter((_, index) => index !== indexRemove);
  setSwiped(updatedData.map(() => false)); // Reset swiped states
  setData(updatedData);
};

  return (
    // NAVIGATION HEADER
      <Box paddingTop='4rem' display='block' justifyItems='center' >
        <Box bg='white' p={3} display='inline-flex' position='fixed' zIndex='1'>
          <IconButton ml={2} mr={5} aria-label="Back" icon={<FaArrowLeft />} 
          onClick={goHome}/> 
          <Text 
          fontWeight='500'
          fontSize='1.75rem' flexGrow='1' > 
            {name} Day Routine
          </Text>
          <Box display='flex' justifyContent='end'> 
            <IconButton justifySelf='end' ml={2} mr={5} aria-label="Back" icon={< FaHistory/>} 
            onClick={getPrev}/> 
          </Box>
        </Box>
        {loading ?
          <Box display='flex' justifyContent='center'>
            <Spinner mt='10rem' />
          </Box>
          :
          
            <Box mt='5rem'>
              {/* <Text textDecoration='underline'padding ='1rem' fontWeight='400'> List of Exercises </Text> */}
          {buttonData.map((item, index) => {

          return (
            <Box
              key={index}
              pr="1rem"
              pl="1rem"
              pb="2rem"
              mt={index === 0 ? "1.5rem" : "0"}
              display="flex"
              flexDirection="column"
              transition="transform 1.5s ease-in-out"
              ml={swiped[index] ? "-5rem" : "0"} // Conditional transform
            >
  <Box display="block" gap="1rem">
    {/* Ensure SwipeableComponent width adjusts with padding */}
    <SwipeableComponent
      key={index}
      onSwipeLeft={() => handleSwipeLeft(index)}
      onSwipeRight={() => handleSwipeRight(index)}
      display="flex"
      alignItems= "center"
      gap= "1rem"
      width='100%'
    >
      <Box display="flex" gap="1rem" width="100%">
        {/* Text takes full width */}
        <Text
          display="flex"
          fontWeight="bold"
          fontSize="1rem"
          whiteSpace="normal"
          alignSelf="center"
        >
          {item[0]}
        </Text>
        {/* Buttons */}
        <Box
          display="flex"
          justifyContent="end"
          gap="1rem"
          alignItems="center"
          flexGrow='1'
        >
          <IconButton
            aria-label="Refresh"
            icon={<FaSync />}
            onClick={() => handleRefresh(index, buttonData)}
          />
          <Button
            textColor="white"
            bg={visibleStates[index] ? "grey" : "#294e8a"}
            onClick={() => {
              handleButtonClick(index);
            }}
          >
            {visibleStates[index] ? "Close" : "View"}
          </Button>
        </Box>
      </Box>
    </SwipeableComponent>
  </Box>
                  {visibleStates[index] ? (
                    <Box padding='1rem' display='flex' flexDirection='column' gap='0.75rem'>
                      <Flex direction='row' p={1} gap='2rem'>
                        <Box
                          flex="1"
                          height="20%"
                          width='100%'
                          bg="gray.200"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Image
                            src={item[1]}
                            alt={`Exercise ${index}`}
                            objectFit="cover"
                            boxSize="100%"
                          />
                          <Text> {item[2]? item[2]: null} </Text>
                        </Box>
                      </Flex>
                      <Box display='flex' flexGrow='1' gap='1rem' justifyContent='center'>
                        <form onSubmit={(e) => handleSubmit(e, { item }, { sets }, { weight }, { reps })}>
                          <label htmlFor="weight" />
                          <Input style={{ marginTop:'0.25rem', marginBottom:'0.25rem', display: 'inline-flex', width: '100%', zIndex: '0' }} 
                            placeholder='Weight' id="Weight"
                            value={weight} onChange={(e) => setWeight(e.target.value)} 
                          />
                          <label htmlFor="number of sets" />
                          <Input style={{  marginTop:'0.25rem', marginBottom:'0.25rem', display: 'inline-flex', width: '100%', zIndex: '0' }} 
                            placeholder='Sets' id="sets"
                            value={sets} onChange={(e) => setSets(e.target.value)} 
                          />
                          <label htmlFor="number of reps" />
                          <Input style={{  marginTop:'0.25rem', marginBottom:'0.25rem', display: 'inline-flex', width: '100%', zIndex: '0' }} 
                            placeholder='Reps' id="reps"
                            value={reps} onChange={(e) => setReps(e.target.value)} 
                          />
                          <Box display='flex' justifyContent='center'>
                            <Divider width='100%' justifyItems='center' pt='1rem' />
                          </Box>
                          <Box p={4} display='grid' mt='0.5rem' mb='0.5rem'>
                            <Button type='submit' justifySelf='center' bg='#282c34' color='white'>
                              Submit Input Values 
                            </Button>
                          </Box>
                        </form>
                      </Box>
                    </Box>
                  ) : null}
            <FloatingButton name={name} buttonData={buttonData} />
          </Box>)})}
      </Box>}
      </Box>
)};


export default Routine;