import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbot from './components/Chatbot';
import ContentAnalysis from './components/ContentAnalysis';
import Hero from "./components/Hero";
import ThoughtAnalysis from './components/ThoughtAnalysis';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/content-analysis" element={<ContentAnalysis />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/thought-analysis" element={<ThoughtAnalysis />} />
      </Routes>
    </Router>
    </>
  )
}

export default App