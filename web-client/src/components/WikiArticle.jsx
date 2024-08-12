import React, { useState, useEffect } from 'react'

function WikiArticle({ article }) {
  return (
    <div>
      <a 
      href={article.content_urls.desktop.page}
      className="block"
      target="_blank"
      rel="noopener noreferencer"
      dangerouslySetInnerHTML={{__html: article.displaytitle}}
      />

      <div className="flex items-center space-x-4">
        <div dangerouslySetInnerHTML={{__html: article.extract_html}} className="line-clamp-6 text-sm"/>
        <img src={article.thumbnail.source} className="w-32 h-32"/>
      </div>
    </div>
  )
}

export default WikiArticle
