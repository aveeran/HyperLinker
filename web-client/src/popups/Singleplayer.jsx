import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";


function Singleplayer() {
    const navigate = useNavigate();
    const [customizations, setCustomizations] = useState({});
    const [mode, setMode] = useState("");
    const [startArticle, setStartArticle] = useState({});
    const [endArticle, setEndArticle] = useState({});
    const [pathLength, setPathLength] = useState(0);
    const [isPathDirected, setIsPathDirected] = useState(true);
    const [pathArticles, setPathArticles] = useState([]);
    const [timer, setTimer] = useState(0);


    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if(message.action === 'customizations') {
        const sentCustomizations = message.data;
        setCustomizations(sentCustomizations);
        setMode(sentCustomizations.mode.type)
        setStartArticle(sentCustomizations.start);
        setEndArticle(sentCustomizations.end);
        setPathLength(sentCustomizations.mode.path.pathLength);
        setIsPathDirected(sentCustomizations.mode.path.directed);
        setPathArticles(sentCustomizations.mode.path.intermediate_links);
        setTimer(sentCustomizations.mode.countDown.timer);
      }
    })
  return (
    <div>
      <button onClick={() => navigate(-1)}>quit</button>

      {


// the tracker
      }

      {
        // the path progression
      }

      {
        // quit/give-up/hint/answer? HINT??
      }


      {
        console.log(customizations)        
      }
      {console.log(mode)} {console.log(startArticle)}
      {console.log(endArticle)}
      {console.log(pathLength)}
      {console.log(isPathDirected)}
      {console.log(pathArticles)}
      {console.log(timer)}
    </div>
  )
}

export default Singleplayer
