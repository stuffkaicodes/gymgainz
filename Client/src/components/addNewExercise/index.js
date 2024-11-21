// DataTable.js
import React, { useEffect, useState} from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Table, Tbody, Tr, Td, IconButton, Checkbox, Button, Text , Fade} from '@chakra-ui/react';
import { FaArrowLeft, FaSmile } from 'react-icons/fa';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedCount, setCheckedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const resultsPerPage = 8;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Decode the buttonData
  const buttonData = JSON.parse(queryParams.get('data'));

  const {name, exercise} = useParams();

  const navigate = useNavigate();
  
  // go back to home page 
  const goHome = () => {
    navigate(`/routine/${name}`); 
    }
  
  useEffect(() => {
    const fetchData = async () => {

      try {

      const queryString = `exercise=${encodeURIComponent(JSON.stringify(exercise))}`;

        // const response = await fetch(`http://172.20.10.2:3001/routine/${name}/add/${exercise}`);
        const response = await fetch(`http://localhost:3001/routine/${name}/add/${exercise}`);
        const data =  await response.json()
        setData(data);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // const response = ['Exercise1', 'Exercise2', 'Exercise3', 'Exercise4'];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showPopup]);

  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(updatedCheckedItems);
    setCheckedCount(Object.values(updatedCheckedItems).filter(Boolean).length);
  };

  const handleSubmit = async () => {
    const checkedData = data.filter((_, index) => checkedItems[index]);
    const exercises = await Promise.all(
      buttonData.map(async (item) => item[0]) // Collect each `item[0]` into the array
    );
    console.log(exercises);

    try {
      const response = await fetch(`http://localhost:3001/routine/${name}/add/${checkedData}/${exercises}`);
      // const response = await fetch(`http://172.20.10.2:3001/routine/${name}/add/${checkedData}/${exercises}`);
      const newData = await (response.json());
      console.log(newData);
      setShowPopup(true);
      setTimeout(() => {
        navigate(`/routine/${name}`, {state: newData});
      }, 1450); // Adjust delay as needed
    } catch(error){
      console.log(error);
    }

  };

  const totalPages = Math.ceil(data.length / resultsPerPage);
  const startIndex = currentPage * resultsPerPage;
  const currentData = data.slice(startIndex, startIndex + resultsPerPage);

  return (
    <Box>
      { showPopup ? 
      (
        <Fade in={showPopup}>
      <Box 
        display="flex"
        position="fixed"
        top="50%" 
        left="50%" 
        transform="translate(-50%, -60%)" // Center the box in the viewport
        bg='#DBF3C9'
        p={6} 
        gap='0.75rem'
        maxWidth="65%" 
        height='fit-content'
        borderRadius="md" 
        boxShadow="lg" 
        zIndex="9999"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <FaSmile color='green' fontSize='2rem'/>
        <Text fontSize="lg" fontWeight="regular" color="green.500" mb={4}>
          The exercise(s) have been added!
        </Text>
        </Box>
      </Fade>
      )
      : null }
        {/* NAVIGATION HEADER */}
        <Box paddingTop='4rem' display='block' justifyItems='center' opacity={showPopup ? 0.2: 1}>
          <Box bg='white' p={2.5} width='100%' display='inline-flex' position='fixed' zIndex='1'>
              <IconButton ml={2} mr={5} aria-label="Back" icon={<FaArrowLeft />} onClick={ goHome }/> 
              <Text 
              fontWeight='500' display='flex' flexGrow='1'
              fontSize='1.75rem' > 
              {name} Day Routine
              </Text>
          </Box>
          <Box marginTop="2.5rem" padding="1rem">
          <Text zIndex='999' textAlign="right" color='grey' marginBottom="1rem" fontWeight='600'>Checked Count: {checkedCount}</Text>
          <Table variant="simple" colorScheme="navy">
              <Tbody>
                  {currentData.map((item, index) => (
                  <Tr key={startIndex + index}>
                  <Td display='flex'>
                      <img src="placeholder.gif" alt="placeholder" style={{ width: '3rem', height: '3rem', alignContent:'center' }} />
                      <Text marginLeft="2rem" display="inline-block" flexGrow='1' alignContent='center'>{item}</Text>
                  </Td>
                  <Td>
                      <Checkbox size='lg' alignContent='center'
                      isChecked={checkedItems[startIndex + index]}
                      onChange={() => handleCheckboxChange(startIndex + index)}
                      />
                  </Td>
                  </Tr>
              ))}
              </Tbody>
          </Table>
          <Box display="flex" justifyContent="space-between" marginTop="1rem">
              <Button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} 
              isDisabled={currentPage === 0}
              >
              Previous
              </Button>
              <Text>Page {currentPage + 1} of {totalPages}</Text>
              <Button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} 
              isDisabled={currentPage === totalPages - 1}
              >
              Next
              </Button>
          </Box>
          <Box zIndex='9999' width='100%' display='flex' alignItems='center' justifyContent='center' margin='0.75rem'>
          <Button onClick={handleSubmit} marginTop="1rem">Submit Checked Data</Button>
          </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default DataTable;
