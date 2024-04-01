import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";

import Wheel from "./components/Wheel";
const App = () => {
    return (
      
      <Router hashType="slash">
        <Routes>
          <Route path="/" element={<Wheel/>} />
        </Routes>
      </Router>
    );
};

export default App;