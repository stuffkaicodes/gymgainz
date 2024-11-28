import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie"; // Library to manage cookies

// Create AuthContext
const AuthContext = createContext();

// Hook to use the context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [user, setUser] = useState('');

    // Check the session cookie on app load
    // useEffect(() => {
    //     const sessionToken = Cookies.get("session_token"); // Replace with your cookie name
    //     if (sessionToken) {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

    const logout = () => {
        const removed = getToken();
        Cookies.remove(removed); // Remove the session cookie
        setIsLoggedIn(false);
        setUser('')
    };

    const login = (token, username) => { 
        Cookies.set("token", token, { expires: 1 });
        setIsLoggedIn(true);
        setUser(username);
        setToken(token);
    }

    const getToken = () => {
        return Cookies.get("token"); // Retrieve token from cookies
      };

    return (
        <AuthContext.Provider value={{ user, setUser, token , getToken, login, isLoggedIn, setIsLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
