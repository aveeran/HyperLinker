import React from 'react'
import { useNavigate } from "react-router-dom";


function Singleplayer() {
    const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(-1)}>quit</button>
    </div>
  )
}

export default Singleplayer
