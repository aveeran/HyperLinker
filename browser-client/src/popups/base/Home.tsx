import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WikiArticle from "../../components/WikiArticle";
import { MODE, SINGLE_PLAYER, MULTI_PLAYER, RESET, getFormattedDate } from "../../utils/utils";

interface Article {
  content_urls: {
    desktop: {
      page: string;
    };
  };
  extract_html: string;
  thumbnail: {
    source: string;
  };
}

function Home() {
  const [wikiContent, setWikiContent] = useState<Article | null >(null);
  const [wikiLoading, setWikiLoading] = useState<boolean>(true);
  const [wikiError, setWikiError] = useState<Error | null>(null);

  const [newsContent, setNewsContent] = useState<string>("");
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const isChromeExtension = useMemo<boolean>(() => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  }, []);

  

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const formattedDate = getFormattedDate();
        const response = await fetch(
           `https://en.wikipedia.org/api/rest_v1/feed/featured/${formattedDate}`
        );
        if(!response.ok) {
          throw new Error("Unable to retrieve information from Wikipedia"); // TODO: network error?
        }
        const text = await response.json();
        setWikiContent(text.tfa);
        setWikiLoading(false);
      } catch (error) {
        setWikiError(error as Error);
        setWikiLoading(false);
      }
    };
    fetchHtml();
  }, []);

  const handleResetClick = () => {
    if(isChromeExtension) {
      chrome.runtime.sendMessage({action: RESET});
    } 
  }

  const handleSingleplayerClick = () => {
    if(isChromeExtension) {
      chrome.storage.local.set({[MODE] : SINGLE_PLAYER}, () => {
        navigate("/dashboard");
      });
    } else {
      navigate("/dashboard");
    }
  }

  const handleMultiplayerClick = () => {
    if(isChromeExtension) {
      chrome.storage.local.set({[MODE] : MULTI_PLAYER}, () => {
        navigate("/dashboard");
      });
    } else {
      navigate("/dashboard");
    }
  }

  return (
    <div className="pt-3 p-1">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>

      <div className="bg-green-100 border-green-200 border-solid border-2 mb-1 p-3">
        <div className="bg-green-300 p-1 border-gray-400 border-solid border-2">
          <p className="text-center inline-block font-medium text-lg">
            From today&apos;s featured article
          </p>
        </div>
        {wikiLoading ? (
          <p>Loading...</p>
        ) : wikiError ? (
          <p>Error: {wikiError.message}</p>
        ) : (
          wikiContent && <WikiArticle article={wikiContent} />
        )}
      </div>

      <div className="bg-sky-100 border-slate-400 border-solid border-2 mb-3 p-3">
        <div className="bg-sky-200 p-1 border-gray-400 border-solid border-2">
          <p className="text-center inline-block font-medium text-lg">In the news</p>
        </div>
        <p className="font-serif">Currently no news!</p>
      </div>

      <div className="flex gap-4 p-4 justify-center">
        <button
          className="bg-green-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={handleSingleplayerClick}
        >
          Single Player
        </button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={handleMultiplayerClick}>
          Multiplayer
        </button>
        <button
          className="bg-red-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={handleResetClick}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Home;