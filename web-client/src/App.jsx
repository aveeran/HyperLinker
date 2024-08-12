import Home from "./popups/home.jsx";
import './index.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SingleplayerDashboard from "./popups/SingleplayerDashboard.jsx";

function App() {
  return (
    <Router>
      <div className="w-[400px] border-black border-solid border-[3px]">
      <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/singleplayer_dashboard" element={<SingleplayerDashboard/>}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
