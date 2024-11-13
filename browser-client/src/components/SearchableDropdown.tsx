import { useEffect, useState } from "react";
import { defaultArticle, Article, Suggestion } from "../utils/utils";

function SearchableDropdown({onDataChange, index = 0, temp=defaultArticle} : {onDataChange: (suggestion: Suggestion) => void;
    index?:number; temp?:Article;
}) {
    const [query, setQuery] = useState<string>(temp.title);
    const [suggestions, setSuggestions] = useState<Article[]>([temp]);
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [test, setTest] = useState<boolean>(true);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    useEffect(() => {
        if(isTyping && query.length > 0) {
            if(test) {
                fetchSuggestions(query);
                setTest(false);
            }
            setTest(true);
        } else {
            setSuggestions([]);
            setIsDropdownVisible(false);
        }
    }, [query]);

    const fetchSuggestions = async (query: string) => {
        try {
            const response = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`
              );
            const data = await response.json();

            const articles = data.query.search.map((article : any) => ({
                title: article.title,
                pageid: article.pageid,
            }));

            const articleWithLinks = await fetchArticleLinks(articles);
            setSuggestions(articleWithLinks);
            setIsDropdownVisible(true);
        } catch (error) {
            console.error("Error fetching suggestions: ", error);
        }
    };

    const fetchArticleLinks = async (articles : any) : Promise<Article[]> => {
        const pageIds = articles.map((article : any) => article.pageid).join('|');
        try {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&pageids=${pageIds}&prop=info&inprop=url`
          );
          const data = await response.json();
      
          // Map the URLs back to the articles
          return articles.map((article: any) => ({
            title: article.title,
            link: data.query.pages[article.pageid].fullurl,
          }));
        } catch (error) {
          console.error("Error fetching article links:", error);
          return articles; 
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true);
        const newQuery = event.target.value;
        setQuery(newQuery);

        const exactMatch = suggestions.find(
            (suggestion) => suggestion.title.toLowerCase() === newQuery.toLowerCase()
        );

        if(exactMatch) {
            onDataChange({article: exactMatch, index});
        } else {
            onDataChange({article:{title: newQuery, link:""}, index});
        }
    };

    const handleSuggestionClick = (suggestion : Article) => {
        setIsTyping(false);
        setTest(false);
        setQuery(suggestion.title);
        setIsDropdownVisible(false);
        onDataChange({article: suggestion, index});
    };

    const handleBlur = () => {
        setTimeout(() => setIsDropdownVisible(false), 500);
    };

    return (
        <div onBlur={handleBlur}>
          <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
                placeholder="Search Wikipedia..."
                
              />
              {isDropdownVisible && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
        </div>
    );
}
    
export default SearchableDropdown