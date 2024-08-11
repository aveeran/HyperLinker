import React from 'react'

function Home() {
  return (
    <div className="w-[25vw]">
      <h1 className="text-4xl font-sans">HyperLinker</h1>

      <div>
        <h5 className="text-2xl">Article of the Day</h5>

      </div>

      <div>
        <h5 className="text-2xl">
            News
        </h5>
      </div>

      <div className="flex gap-4 p-4 border border-gray-200">
        <button className="bg-green-400 text-white px-4 py-2 rounded">Single Player</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded">Multiplayer</button>
      </div>
    </div>
  )
}

export default Home
