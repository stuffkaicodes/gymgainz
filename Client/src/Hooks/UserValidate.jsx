import React, { useState } from 'react'; 

function ValidateInputs(name, username, password) {

    const newErrors = { name:"", username: "", password: "" };

    if (!name){
        newErrors.name = 'Name should not be empty.'
    } else{
        delete newErrors.name;
    }

    // Username Validation
    if (!username) {
        newErrors.username = "Username should not be empty.";
        } else if (username.length < 3) {
        newErrors.username = "Username must be at least 3 characters long.";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores.";
    } else{ 
        delete newErrors.username;
    }
    
        // Password Validation
    if (!password) {
        newErrors.password = "Password should not be empty.";
        } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        newErrors.password = "Password must contain at least one letter and one number.";
    } else{ 
        delete newErrors.password;
    }

    return newErrors; // Return true if no errors
    };

export default ValidateInputs;