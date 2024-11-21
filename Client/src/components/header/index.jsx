import '../home/Home.css';
import { Box, Flex, Icon } from "@chakra-ui/react";
import { IoHome, IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import React from 'react'; 
// import moment from "moment";
import LiveClock from './clock.jsx';

function Header() {

  const navigate = useNavigate();
  
  // go back to home page 
  const goHome = () => {
    navigate(`/`); 
  }

  // go back to home page 
  const goLogin = () => {
    navigate(`/login`); 
  }

  return (

      <Box zIndex='99' top='0' left='0' position='fixed' width='100%' p={4} justifyContent='space-between' backgroundColor="#282c34" color='white'>
      <Flex alignItems="center">
        <Box width='33.33%'>
        <LiveClock width='20%'/>
        </Box>

        {/* Centered Home Icon */}
        {/* <Spacer width='20%' /> */}
        <Box width='33.33%' display='flex' justifyContent='center'>
        <Icon as={IoHome} onClick={goHome} fontSize='2xl'/>
        </Box>
        {/* <Spacer width='20%' /> */}

        {/* Logout Icon */}
        <Box display='flex' flex='1' width='33.33%' justifyContent='end'>
        <Icon as={IoLogOut} onClick={goLogin}  fontSize='2xl' />
        </Box>

      </Flex>
      </Box>
)};

export default Header;