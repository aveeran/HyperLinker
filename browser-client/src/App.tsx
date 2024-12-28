import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './popups/base/Home.tsx';
import Dashboard from './popups/base/Dashboard.tsx';
import RouterTracker from './popups/base/RouterTracker.tsx';
import ModeChoice from './popups/base/ModeChoice.tsx';
import TrackerChoice from './popups/base/TrackChoice.tsx';
import RestrictionsChoice from './popups/base/RestrictionsChoice.tsx';
import Game from './popups/base/Game/Game.tsx';
import GameStat from './popups/base/GameStat/GameStat.tsx';


function App() {

  return (
    <Router 
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
  }}>
      <div className="w-[400px] border-black border-solid border-[3px] rounded-md pt-1">
        <RouterTracker/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/dashboard/mode" element={<ModeChoice/>}/>
          <Route path="/dashboard/track" element={<TrackerChoice/>}/>
          <Route path="/dashboard/restrictions" element={<RestrictionsChoice/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/gameEnd" element={<GameStat/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
