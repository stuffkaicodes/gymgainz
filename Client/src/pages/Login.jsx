import React, { useState, useEffect, useMemo} from 'react';
import { Input, Box, Button, FormControl, FormLabel, InputGroup, InputRightElement, Text, FormErrorMessage } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'; 
import ValidateInputs from '../Hooks/UserValidate.jsx';

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ username: "", password: "" });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if ({ValidateInputs}) {
            try{
                const user = {username, password}
                const response = await fetch('http://localhost:3001/login/',{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                });
                if (response.status == 200){
                    alert(`Welcome back to Gymgainz ${username}`)
                    navigate(`/`); 
                } else if (response.message =='username') {
                    const newErrors = { username: 'Username does not exist!', password: ''}
                    setErrors(newErrors);
                } else{
                    const newErrors = { username: '', password: 'Incorrect Password!'}
                    setErrors(newErrors);
                }
            } catch(error){
            console.log(error)
            }}
        else{
            console.log(errors);
            }
    };

    function handleClick() {
        navigate(`/register`); 
    }

    return (
        <Box display='flex' flexDirection='column' p='2rem' pt='8rem' width='100%' gap='2rem' zIndex='999'>
            <Text display='flex' lineHeight='3rem' fontSize='3rem' fontWeight='600'>
                Welcome to GymGainz.
            </Text>
            <Box display='block' gap='1rem'>
                <form onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <FormControl isInvalid={!!errors.username} mb="4">
                        <FormLabel>Username</FormLabel>
                        <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                        size="lg"
                        borderRadius="md"
                        focusBorderColor="blue.400"
                        bg="gray.50"
                        _focus={{ bg: "white", boxShadow: "0 0 0 2px blue.200" }}
                        />
                        {errors.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
                    </FormControl>

                    {/* Password Input */}
                    <FormControl isInvalid={!!errors.password} mb="4">
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="lg">
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            borderRadius="md"
                            focusBorderColor="blue.400"
                            bg="gray.50"
                            _focus={{ bg: "white", boxShadow: "0 0 0 2px blue.200" }}
                        />
                        <InputRightElement width="4.5rem">
                            <Button size="sm" onClick={togglePasswordVisibility}>
                            {showPassword ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                        </InputGroup>
                        {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>} 
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                    type="submit"
                    width="full"
                    backgroundColor="#282c34"
                    color='white'
                    size="lg"
                    mt="4"
                    variant='noHover'
                    >
                        Login
                    </Button>
                </form>

                <Text textDecoration='underline' mt='1rem' onClick={handleClick}>
                    New User? Register Here!
                </Text>
            </Box>
        </Box>
    )
}

export default Login;