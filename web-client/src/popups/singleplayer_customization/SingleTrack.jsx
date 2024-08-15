import React, { useState } from 'react'

function SingleTrack() {
  const [track, setTrack] = useState('clicks');

  const handleOptionChange = (event) => {
    setTrack(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(track);
  }


  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex flex-col mb-4">
          <label htmlFor="clicks" className="mr-4">
            <input 
            type="radio"
            id="clicks"
            name="tracking"
            value="clicks"
            checked={track==='clicks'}
            onChange={handleOptionChange}
            className="mr-2"
            />
            <span>Clicks</span>
          </label>
          <label htmlFor="time" className="mr-4">
            <input 
            type="radio"
            id="time"
            name="tracking"
            value="time"
            checked={track==='time'}
            onChange={handleOptionChange}
            className="mr-2"
            />
            <span>Time</span>
          </label>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  )
}

export default SingleTrack
