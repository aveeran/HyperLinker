import React, { useState, useEffect } from "react";

function WikiArticle({ article }) {
  return (
    <div>
      <div className="flex items-center space-x-4 p-2">
        <a
          href={article.content_urls.desktop.page}
          target="_blank"
          rel="noopener noreferencer"
          dangerouslySetInnerHTML={{ __html: article.extract_html }}
          className="line-clamp-6 text-sm w-72"
        />
        <a
          href={article.thumbnail.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={article.thumbnail.source} className="w-32 h-32" />
        </a>
      </div>
    </div>
  );
}

export default WikiArticle;
