import React, { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import Modal from "./components/Modal";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const removeArticle = async (article) => {
  await axios.post("/api/removeArticle", article);
};

export default function Home() {
  const { data, error } = useSWR("/api/news", fetcher);
  const [showModal, setShowModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);
  const [gpt3Response, setGPT3Response] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    if (data) {
      setArticles(data);
    }
  }, [data]);

  if (error) return <div>Error loading news</div>;
  if (!data) return <div>Loading...</div>;

  const handleRemoveArticle = async (indexToRemove) => {
    await removeArticle(articles[indexToRemove]);
    const updatedArticles = articles.filter(
      (_, index) => index !== indexToRemove
    );
    setArticles(updatedArticles);
  };

  const handleModalButtonClick = (index) => {
    console.log("Opening modal...");
    setSelectedArticleIndex(index);
    toggleModal();
  };

  const handleGPT3Response = async (title, index) => {
    handleModalButtonClick(index);

    const articleLink = articles[index]?.link;
    const prompt = `Write a 300 word factual summary of the following article:\n`;

    // Check if there's a scraper for the link's hostname
    console.log(`Article link: ${articleLink}`);
    console.log(`Prompt: ${prompt}`);
    const linkHostname = new URL(articleLink).hostname;
    if (linkHostname === "decrypt.co") {
      try {
        const articleContent = await fetchArticleContent(articleLink);
        const formatedArticleContent = JSON.stringify(articleContent);
        const finalPrompt = `${prompt}\n\nUse the following content for the summary as a source of information: ${formatedArticleContent}`;
        const response = await axios.post("/api/openaiApi", {
          prompt: finalPrompt,
        });
        setGPT3Response(response.data);
      } catch (error) {
        console.error(error);
        return;
      }
    } else {
      alert("Error: No existing scraper to use for this site.");
      return;
    }
  };

  async function fetchArticleContent(url) {
    console.log(url);
    const response = await axios.get(
      `/api/scrapeArticle?url=${encodeURIComponent(url)}`
    );
    return response.data.content;
  }

  const handleAddNews = async () => {
    // Check if both fields are filled
    if (title === "" || url === "") {
      alert("Both fields must be filled out");
      return;
    }

    // Add the new news object to the news.json file and display it in the terminal
    try {
      const response = await fetch("/api/addNews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
      });

      if (response.ok) {
        const newsItem = await response.json();
        console.log("News item added:", newsItem);
      } else {
        console.error("Error adding news item");
      }
    } catch (error) {
      console.error("Error adding news item:", error);
    }

    // Clear the input fields
    setTitle("");
    setUrl("");
  };

  return (
    <div className="container">
      {showModal && (
        <Modal
          onClose={toggleModal}
          responseText={gpt3Response}
          isLoading={isLoading}
        />
      )}
      <div className="header-container">
        <h1 className="header-text">Web3 News Terminal</h1>
      </div>
      <div className="terminal">
        {articles.map((article, index) => (
          <div key={index} className="news-headline">
            <p>
              {index + 1}.{" "}
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <span
                className="article-modal-button"
                onClick={() => {
                  handleGPT3Response(article.title, index);
                }}
              ></span>
              <span
                className="article-remove-button"
                onClick={() => handleRemoveArticle(index)}
              >
                -
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          className="news-input"
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="news-input"
          placeholder="Article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="add-news-button" onClick={handleAddNews}>
          Add News
        </button>
      </div>
    </div>
  );
}
