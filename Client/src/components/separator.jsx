import { Box } from "@chakra-ui/react";
import { FaGripLines } from 'react-icons/fa6'; 

function LineSeparator() {
  return (
      <Box width='100%' display='flex' justifyContent='center'>
        <FaGripLines/> 
      </Box>
  );
}

export default LineSeparator;
