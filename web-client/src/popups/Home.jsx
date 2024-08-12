import React, { useState, useEffect } from 'react'
import { HashRouter, Router, Routes, Link } from 'react-router-dom'

function Home() {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
    
  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day}`;

        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/featured/${formattedDate}`);
        if(!response.ok) {
          throw new Error('Unable to retrieve information from Wikipedia');
        }
        const text = await response.json();
        setHtmlContent(text.tfa);
        setLoading(false);
        console.log(text.tfa);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchHtml();
  }, []);


  return (
    <div>
      <h1 className="text-4xl text-center mb-3">HyperLinker</h1>
      <h5 className="text-2xl text-center mb-3">Article of the Day</h5>
      <div className="border-black border-2 border-solid p-1.5 m-3">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <a 
          href={htmlContent.content_urls.desktop.page} 
          className="block"  
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{__html: htmlContent.displaytitle}}
          />
          <div className="flex items-center space-x-4">
            <div dangerouslySetInnerHTML={{__html: htmlContent.extract_html}} className="line-clamp-6 text-sm"/>
            <img src={htmlContent.thumbnail.source} className="w-32 h-32"/>
          </div>
        </div>
      )}
      </div>
      <div>
        <h5 className="text-2xl text-center mb-3">
            News
        </h5>
      </div>

      <div className="flex gap-4 p-4 justify-center">
        <button className="bg-green-400 text-white px-4 py-2 rounded">Single Player</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded">Multiplayer</button>
      </div>
    </div>
  )
}

export default Home
