import React, { useState, useEffect } from 'react';

import './App.css';

import LeftSidebar from './components/left-sidebar/LeftSidebar';
import RightBody from './components/right-body/RightBody';
import AddClient from './components/modals/add-client/AddClient';

function App() {
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  return (
    <div className="App">
      <LeftSidebar/>
      <RightBody setShowAddClientModal={setShowAddClientModal}/>
      {showAddClientModal && <AddClient/>}
    </div>
  );
}

export default App;
