import Home from "./popups/home.jsx";
import './index.css';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import SingleplayerDashboard from "./popups/SingleplayerDashboard.jsx";
import SingleMode from "./popups/singleplayer_customization/SingleMode.jsx";
import SingleTrack from "./popups/singleplayer_customization/SingleTrack.jsx";
import SingleRestrictions from "./popups/singleplayer_customization/SingleRestrictions.jsx";
import RouteTracker from "./popups/RouterTracker.jsx";
import Singleplayer from "./popups/Singleplayer.jsx";
import SingleplayerGameStat from "./popups/SingleplayerGameStat.jsx";


function App() {

  return (
  
    <Router>
      <div className="w-[400px] border-black border-solid border-[3px] rounded-md pt-1">
        {/* <Singleplayer/> */}
        <RouteTracker/>
       <Routes>
        <Route path ="/" element={<Home/>}/>
        <Route path ="/singleplayer_dashboard" element={<SingleplayerDashboard/>}/>
        <Route path ="/singleplayer_dashboard/singleplayer_customization/mode" element={<SingleMode/>}/>
        <Route path ="/singleplayer_dashboard/singleplayer_customization/track" element={<SingleTrack/>}/>
        <Route path ="/singleplayer_dashboard/singleplayer_customization/restrictions" element={<SingleRestrictions/>}/>
        <Route path="/singleplayer" element={<Singleplayer/>}/>
        <Route path="/singleplayer-end" element={<SingleplayerGameStat/>}/>
      </Routes>

      </div>
    </Router>
  );
}

export default App;