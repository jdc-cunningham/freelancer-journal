import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

import LeftSidebar from './components/left-sidebar/LeftSidebar';
import RightBody from './components/right-body/RightBody';
import AddClient from './components/modals/add-client/AddClient';

const baseApiPath = window.location.href.includes('localhost')
  ? 'http://localhost:5135' : 'http://192.168.1.144:5135'; // developed for local API

function App() {
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [openClient, setOpenClient] = useState(null);

  return (
    <div className="App">
      <LeftSidebar baseApiPath={baseApiPath} openClient={openClient} setOpenClient={setOpenClient}/>
      <RightBody setShowAddClientModal={setShowAddClientModal} openClient={openClient}/>
      {showAddClientModal && <AddClient baseApiPath={baseApiPath} setShowAddClientModal={setShowAddClientModal}/>}
    </div>
  );
}

export default App;
