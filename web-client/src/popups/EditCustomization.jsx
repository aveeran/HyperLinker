import React from 'react'

function EditCustomization( {singleplayer = true}) {
  return (
    <div>
      {singleplayer ? 
      (<p>a</p>) : (<p>b</p>)}
    </div>
  )
}

export default EditCustomization
