import { useContext, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Home from './pages/home/Home'
import Login from './pages/login/Login'
import SignUp from './pages/signup/SignUp'

// import './App.css'


function App() {
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <Routes>
      {isAuthenticated && <Route path="/" exact element={<Home />}/>}
      <Route path="/signup" exact element={<SignUp />}/>
      <Route path="/login" exact element={<Login />}/>
      <Route path="/" exact element={<Navigate replace to='/login'/>}/>
    </Routes>
  )

  // return (
  //   <Routes>
  //     {isAuthenticated === true && <Route path="/" exact element={<Home />} />}
  //     {isAuthenticated === false && <Route path="/" exact element={<Navigate replace to='/login' />} />}
  //     <Route path="/signup" exact element={<SignUp />} />
  //     <Route path="/login" exact element={<Login />} />
  //   </Routes>
  // );
}

export default App
