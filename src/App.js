import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WorkFlow from './pages/WorkFlow';
import DesignWorkFlow from './pages/DesignWorkFlow';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorkFlow />} />
        <Route path="/workflows/modules" element={<DesignWorkFlow />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;