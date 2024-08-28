import React from 'react'
import { useNavigate } from "react-router-dom"

function SingleplayerGameStat() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => {
        navigate("/")
      }}>
        Home
      </button>
    </div>
  )
}

export default SingleplayerGameStat