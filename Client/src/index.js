import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from "./AuthContext.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
      <AuthProvider>
      <App />
      </AuthProvider>
    </ChakraProvider> 
);
