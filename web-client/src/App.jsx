import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./popups/home.jsx";
import Customization from "./popups/Customization.jsx";
import './index.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                </ul>
                <Home />
              </>
            }
          />
          <Route path="/settings" element={<Customization />} />
          <Route path="/about" element={<Customization />} />
        </Routes>
      </Router>
      <p className="text-red-900">Bruh</p>
      
    </>
  );
}

export default App;
