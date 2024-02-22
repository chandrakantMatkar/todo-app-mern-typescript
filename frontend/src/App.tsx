import React from 'react';
import './App.css';
import ManageItem from './components/ManageItem';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import ViewAll from './components/ViewAll';
import Logout from './components/Logout';

function App() {
  
  return (
    <div className="App">
      <div className="App-header">
        <h1>TODO <span style={{ color: 'rgba(15,100,164,255)' }}>LIST</span></h1>
        <Router>
        <Logout/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/manage-todo/*" Component={ManageItem} />
            <Route path="/view-all" Component={ViewAll} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
