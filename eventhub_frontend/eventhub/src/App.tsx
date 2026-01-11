import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { WelcomeScreen } from './components/WelcomeScreen';
import { Toaster } from 'sonner'; // Optional: if you want the notifications to work

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
            <WelcomeScreen 
        onLogin={(email, name) => console.log("Login clicked:", email, name)} 
      />
    </>
  );
}

export default App
