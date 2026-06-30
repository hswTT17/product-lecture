import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ConsultPage from './pages/ConsultPage'

export default function App() {
  const [dark, setDark] = useState(() => (localStorage.getItem('theme') || 'light') === 'dark')

  useEffect(() => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [dark])

  const themeProps = { dark, setDark }

  return (
    <Routes>
      <Route path="/" element={<HomePage {...themeProps} />} />
      <Route path="/consult" element={<ConsultPage {...themeProps} />} />
    </Routes>
  )
}
