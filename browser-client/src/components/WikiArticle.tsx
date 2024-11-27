// import React from 'react';

interface ArticleProps {
    article: {
        content_urls: {
            desktop: {
                page: string;
            };
        };
        extract_html: string;
        thumbnail: {
            source: string;
        };
    };
}

function WikiArticle({article} : ArticleProps) {
    return (
        <div>
            <div className="flex items-center space-x-4 p-2">
                <a
                    href={article.content_urls.desktop.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    dangerouslySetInnerHTML={{__html: article.extract_html}}
                    className="line-clamp-6 text-sm w-72"
                />

                <a 
                    href={article.thumbnail?.source || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={article.thumbnail?.source || ""} className="w-32 h-32" alt="Thumbnail"/>
                </a>
            </div>
        </div>
    )
}

export default WikiArticle;