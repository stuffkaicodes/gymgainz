import React, { useState } from 'react'; 

function ValidateInputs() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({ name:"", username: "", password: "" });

    
    const newErrors = { name:"", username: "", password: "" };

    if (!name){
        newErrors.name = 'Name should not be empty.'
    }

    // Username Validation
    if (!username) {
        newErrors.username = "Username should not be empty.";
        } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters long.";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores.";
    }
    
        // Password Validation
    if (!password) {
        newErrors.password = "Password should not be empty.";
        } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        newErrors.password = "Password must contain at least one letter and one number.";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password; // Return true if no errors
    };

export default ValidateInputs;