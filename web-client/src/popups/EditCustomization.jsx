import React from 'react'

function EditCustomization( {singleplayer = true}) {
    let storedCustomizations = singleplayer ? sessionStorage.getItem('singleplayer-customizations') :
    sessionStorage.getItem('multiplayer-customizations');
    let customizations = JSON.parse(storedCustomizations);

    // the problem is we will need options, etc. that match with the keys and how to add them in 
    // maybe we get addtional utility components? based on if the category is clicked? 

    /*
    OR INSTEAD, WE JUST ALLOW THE USER TO CLICK ON THE KEY AND THEN IT WILL TAKE IT TO A NEW WINDOW W/ ONLY THE FIELD
    */

  return (
    <div>

      
    </div>
  )
}

export default EditCustomization
