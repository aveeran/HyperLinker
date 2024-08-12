import React from 'react'

function SingleplayerDashboard() {
  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">Singleplayer</h2>

      <div className="border-black border-2 border-solid p-1.5 m-3">
        Mode
      </div>

      <div className="border-black border-2 border-solid p-1.5 m-3">
        Rules
      </div>

      <div className="flex justify-center">
        <button className="flex bg-green-400 text-white px-4 py-2 rounded">Start</button>
      </div>
    </div>
  )
}

export default SingleplayerDashboard
