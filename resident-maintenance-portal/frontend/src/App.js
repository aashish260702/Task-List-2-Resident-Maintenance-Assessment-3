import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaintenanceForm from './pages/MaintenanceForm';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MaintenanceForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
