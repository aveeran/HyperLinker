import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './popups/base/Home.tsx';
import Dashboard from './popups/base/Dashboard.tsx';
import RouterTracker from './popups/base/RouterTracker.tsx';


function App() {

  return (
    <Router>
      <div className="w-[400px] border-black border-solid border-[3px] rounded-md pt-1">
        <RouterTracker/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
