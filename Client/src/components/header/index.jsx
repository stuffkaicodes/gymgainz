import '../home/Home.css';
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { IoHome, IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import React from 'react'; 
// import moment from "moment";
import LiveClock from './clock.jsx';
import { useAuth } from "../../AuthContext";
import Cookies from 'js-cookie';

function Header() {

  const { isLoggedIn, logout, user } = useAuth();

  const navigate = useNavigate();
  
  // go back to home page 
  const goHome = () => {
    if (isLoggedIn && window.location.pathname !== '/home' ){
      navigate(`/home`); 
    } else if (window.location.pathname !== '/home'){
      navigate(`/`); 
    }
  }

  // go back to home page 
  const goLogout = () => {
    logout();
    navigate(`/`); 
  }

  return (

      <Box zIndex='99' top='0' left='0' position='fixed' width='100%' p={2.5} justifyContent='space-between' backgroundColor="#282c34" color='white'>
      <Flex alignItems="center">
        <Box width='33.33%'>
        <LiveClock width='20%'/>
        </Box>

        {/* Centered Home Icon */}
        {/* <Spacer width='20%' /> */}
        <Box width='33.33%' display='flex' flexDirection='column' justifyContent='center' gap='0.25rem'>
        <Icon width='100%' as={IoHome} onClick={goHome} fontSize='2xl'/>
        <Text width='100%' textAlign='center'> {isLoggedIn && user ? user : null} </Text>
        </Box>
        {/* <Spacer width='20%' /> */}

        {/* Logout Icon */}
        {isLoggedIn && (<Box display='flex' flex='1' width='33.33%' justifyContent='end'>
        <Icon as={IoLogOut} onClick={goLogout}  fontSize='2xl' />
        </Box>)}

      </Flex>
      </Box>
)};

export default Header;