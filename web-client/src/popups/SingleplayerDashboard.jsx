import React from 'react'
import { useNavigate } from 'react-router-dom';

function SingleplayerDashboard() {
  const navigate = useNavigate();

  let storedCustomizations = sessionStorage.getItem('singleplayer-customizations');
  let customizations = {};
  if(storedCustomizations) {
    customizations = JSON.parse(storedCustomizations);
    customizations.mode = 'a'
  } else {
    customizations = {
      'mode': 'normal',
      'start': 'random',
      'end': 'random',
      'track': ['clicks', 'time'],
      'restrictions': [
        'no-opening-para',
        'no-find',
        'no-back',
        'no-category',
        'no-dates'
      ]
    }
    storedCustomizations = JSON.stringify(customizations);
    sessionStorage.setItem('singleplayer-customizations', storedCustomizations);
  }

  const handleCustomizationClick = () => {
    navigate('singleplayer_customization');
  }
  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h2 className="text-3xl text-center mb-3">Singleplayer</h2>

      <div className="border-black border-2 border-solid p-1.5 m-3">
        <p className="text-center">Customizations</p>
        {Object.entries(customizations).map( ([key, value], index) => (
          <p key={index}>
            <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
          </p>
        ))}
        <div className="flex justify-center">
          <button className="flex bg-gray-600 text-white px-4 py-2 rounded" onClick={handleCustomizationClick}>Edit</button>
        </div>
      </div>


      <div className="flex justify-center">
        <button className="flex bg-green-400 text-white px-4 py-2 rounded">Start</button>
      </div>
    </div>
  )
}

export default SingleplayerDashboard
