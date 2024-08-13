import React, { useState } from 'react'

function SingleMode() {
    const [mode, setMode] = useState('normal');

    const handleModeChange = (event) => {

    }
  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">Singleplayer - Customization</h2>
      <div className="border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center">Mode</p>
        <select 
        value={mode}
        onChange={handleModeChange}
        className="block mx-auto p-2 border rounded"
        >
            <option value=""disabled>Select a mode</option>
            <option value="normal">Normal</option>
            <option value="count-down">Count-Down</option>
            <option value="hitler">Hitler</option>
            <option value="jesus">Jesus</option>
            <option value="path">Path</option>
        </select>
        

      </div>
    </div>
  )
}

export default SingleMode
