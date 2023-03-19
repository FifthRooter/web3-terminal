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
    try {
      const prompt = `Write a fun, engaging paragraph summary of the following news title (~60 word), and add an appropriate emoji at the end of it:\n${title}`;
      const response = await axios.post("/api/openaiApi", { prompt });
      handleModalButtonClick(index);
      fetchGPT3Response(response.data);
    } catch (error) {
      console.error("Error fetching GPT-3 response:", error);
    }
  };

  async function fetchGPT3Response(prompt) {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/openaiApi", { prompt });
      setGPT3Response(res.data);
    } catch (error) {
      console.error("Error fetching GPT-3 response:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      {showModal && (
        <Modal
          onClose={toggleModal}
          articleTitle={articles[selectedArticleIndex]?.title}
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
    </div>
  );
}
