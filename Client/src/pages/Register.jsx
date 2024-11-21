import React, { useState, useEffect, useMemo} from 'react';
import { Input, Box, Button, FormControl, FormLabel, InputGroup, InputRightElement, Text, FormErrorMessage } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'; 
import ValidateInputs from '../Hooks/UserValidate.jsx';

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({ name:"", username: "", password: "" });

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if ({ValidateInputs}) {
            try{
                const user = {name, username, password}
                const response = await fetch('http://localhost:3001/register/',{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                });
                console.log(await response.json())
                if (response.status == 200){
                    alert(`Welcome to Gymgainz ${name}`)
                    navigate(`/`); 
                } else{
                    alert('Error occured. Please try again')
                }
            } catch(error){
            console.log(error)
            }}
        else{
            console.log(errors);
            }
    };

    function handleClick() {
        navigate(`/login`); 
    }

    return (
        <Box display='flex' flexDirection='column' p='2rem' pt='8rem' width='100%' gap='2rem' zIndex='999'>
            <Text display='flex' lineHeight='3rem' fontSize='3rem' fontWeight='600'>
                Register your Account.
            </Text>
            <Box display='block' gap='1rem'>
                <form onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <FormControl isInvalid={!!errors.username} mb="4">
                        <FormLabel>Name</FormLabel>
                        <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        size="lg"
                        borderRadius="md"
                        focusBorderColor="blue.400"
                        bg="gray.50"
                        _focus={{ bg: "white", boxShadow: "0 0 0 2px blue.200" }}
                        />
                        {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                    </FormControl>
                
                    {/* Email Input */}
                    <FormControl isInvalid={!!errors.username} mb="4">
                        <FormLabel>Username*</FormLabel>
                        <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="youremailhere@email.com"
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
                        <FormLabel>Password*</FormLabel>
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
                        Submit
                    </Button>
                </form>

                <Text textDecoration='underline' mt='1rem' onClick = {handleClick}>
                    Already have an account?
                </Text>
            </Box>
        </Box>
    )
}

export default Register;