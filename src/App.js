import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Overview from './pages/Overview';
// import Statistics from './pages/Statistic';
import Singular from './pages/Singular';
import Multiple from './pages/Multiple';
import Prediction from './pages/Prediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="overview" element={<Overview />} />
          {/* <Route path="statistics" element={<Statistics />} /> */}
          <Route path="statistics/singular" element={<Singular />} />
          <Route path="statistics/multiple" element={<Multiple />} />
          <Route path="prediction" element={<Prediction />} />
        </Route>
      </Routes>
    </Router>
  ); 
}

export default App;
