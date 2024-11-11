import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import WikiArticle from "../../components/WikiArticle";

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

  // const [newsContnet, setNewsContent] = useState<string>("");
  // const [newsLoading, setNewsLoading] = useState<boolean>(true);
  // const [newsError, setNewsError] = useState<Error | null>(null);

  // const navigate = useNavigate();

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
          // onClick={console.log("w")}
        >
          Single Player
        </button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded font-georgia shadow-md">
          Multiplayer
        </button>
        <button
          className="bg-red-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={() => {
            // chrome.runtime.sendMessage({ action: "reset" });
            console.log("reset");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export default Home;