import  { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/HOme'
import Login from '../pages/Login'
import Register from '../pages/Register'

const Router = () => {
  return (
    <Suspense fallback="loading">
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />

    </Routes>
  </Suspense>  )
}

export default Router
