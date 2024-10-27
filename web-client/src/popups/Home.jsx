import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WikiArticle from "../components/WikiArticle.jsx";
import { getFormattedDate } from "../utils/utils.js";
import SingleplayerDashboard from "./SingleplayerDashboard.jsx";
import GameTracker from "../components/GameTracker.jsx";
import PathProgress from "../components/PathProgress.jsx";

function Home() {
  const [wikiContent, setWikiContent] = useState("");
  const [wikiLoading, setWikiLoading] = useState(true);
  const [wikiError, setWikiError] = useState(null);

  const [newsContent, setNewsContent] = useState("");
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  const navigate = useNavigate();

  const handleSingleplayerclick = () => {
    navigate("/singleplayer_dashboard");
  };

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const formattedDate = getFormattedDate();

        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/featured/${formattedDate}`
        );
        if (!response.ok) {
          throw new Error("Unable to retrieve information from Wikipedia");
        }
        const text = await response.json();
        setWikiContent(text.tfa);
        setWikiLoading(false);
      } catch (error) {
        setWikiError(error);
        setWikiLoading(false);
      }
    };
    fetchHtml();
  }, []);

  return (
    <div className="pt-3">
      <p className="text-4xl text-center mb-3 font-custom">HyperLinker</p>

      <div className="bg-green-100">
        <div className="p-3">
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
            <WikiArticle article={wikiContent} />
          )}
        </div>
      </div>

      <h5 className="text-2xl text-center mb-3 font-times">News</h5>
      <div className="border-black border-2 border-solid p-2 m-3 rounded-lg shadow-lg">
        <p className="font-seif">Currently no news!</p>
      </div>

      <div className="flex gap-4 p-4 justify-center">
        <button
          className="bg-green-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={handleSingleplayerclick}
        >
          Single Player
        </button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded font-georgia shadow-md">
          Multiplayer
        </button>
        <button
          className="bg-red-400 text-white px-4 py-2 rounded font-georgia shadow-md"
          onClick={() => {
            chrome.runtime.sendMessage({ action: "reset" });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Home;
