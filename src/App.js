import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginFormPage from './pages/loginFormPage';
import Db from './pages/dbPage';
import AdminControl from './components/DashBoards/AdminControls/adminControl';
import EmployeeConsole from './components/DashBoards/Employee/Features/Console/EmployeeConsole';
import ChatPage from './pages/ChatPage'; // Import the ChatPage component

function App() {
  const [currentUser, setCurrentUser] = useState(null);

 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginFormPage />} />
        <Route path="/login" element={<LoginFormPage />} />
        <Route path="/db" element={<Db />} />
        <Route path="/admin-control" element={<AdminControl />} />
        <Route path="/employee-support" element={<EmployeeConsole />} />
        <Route path="/ticket/:ticketId" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;