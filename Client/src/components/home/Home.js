
import './Home.css';
import { Box, Button, Flex, Icon, Text, Divider} from "@chakra-ui/react";
import buttonList from '../homeButtons/buttonList.json';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const buttonData = buttonList

  const navigate = useNavigate()

  const handleClickRoutine = (name) => {
    navigate(`/routine/${name}`); 
  }

  function handleClickPast() {
    navigate(`/past`); 
  }

  return (
    <div className="Home" height='100vh'>
      <Box className='Main' height='100%' paddingTop='5em' gap='1rem' justifyContent='center' display='grid'>
          <Box display='block' height='auto' padding='2rem' paddingBottom='0.5rem'> 
            <Text fontSize='24px' fontWeight='800'> Choose Your Workout </Text>
            <Box display='flex' flexDirection='column' gap='1.5rem' height='auto' marginTop='1rem'>
              {buttonData.map((workout, index) => {
                return (
                  <Button key={index} width='100%' display='block' onClick={() => handleClickRoutine(workout.name)}>
                    {workout.name} Day
                  </Button>
                )
              })}
            </Box>
          </Box>
          <Divider my={4}/>
          <Button fontSize='18px' fontWeight='600' 
          height='5rem' width='100%' display='block'
          onClick={() => handleClickPast()}> 
            View Past Routines
          </Button>
      </Box>
    </div>
  );
}

export default Home;
