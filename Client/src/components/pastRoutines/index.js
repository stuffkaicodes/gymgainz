import { Box, IconButton, Text, Divider} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import { useState, useEffect } from 'react'; 
import Record from '../records/index';

function PastRoutines() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const navigate = useNavigate()

  const goHome = () => {
    navigate(`/home`); 
  }

  const handleRefresh = () => {
    setLoading(true)
    setUpdate(!update)
  }

  return (
      <Box paddingTop='5rem' display='block' justifyItems='center'>
        <Box p={3} width='100%' display='inline-flex'>
          <IconButton ml={2} mr={5} aria-label="Back" icon={<FaArrowLeft />} 
          onClick={goHome}/> 
          <Text 
          fontWeight='500' display='flex' flexGrow='1'
          fontSize='1.75rem' > 
            Past Records
          </Text>
          <IconButton mr={2} aria-label="Refresh" icon={<FaSync />} 
          onClick={() => console.log("Refresh clicked")}/>
        </Box>
        <Divider width='50%' my={4} justifySelf='center' />
        <Box ml={2} mr={2}>
          <Record />
        </Box>
      </Box>
)};

export default PastRoutines;