import React, { useState } from 'react';
import './App.css'; // Add custom styles if needed
import DataTable from './DataTable'; // Import the DataTable component
import LoginPage from './LoginPage'; // Import the LoginPage component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-container">
      {isLoggedIn ? <DataTable /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
};

export default App;
