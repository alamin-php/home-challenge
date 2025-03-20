import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEYS = {
  newsapi: "caec38267f1849ae9412ad4fa290cf5c",
  guardian: "84559469-efd7-4c65-899d-9f144523237f",
  nytimes: "esEGcOAjVc2CDrqiLDwTzokQ857yh6Ws",
};

const NewsAggregator: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const newsapiRes = await axios.get(
        // `https://newsapi.org/v2/everything?q=${search || "latest"}&from=${date}&category=${category}&apiKey=${API_KEYS.newsapi}`

        `https://newsapi.org/v2/everything?q=${
          search || "latest"
        }&from=${date}&category=${category}&sources=${source}&apiKey=${
          API_KEYS.newsapi
        }`
      );
      console.log("NewsAPI Response:", newsapiRes.data);

      //   const guardianRes = await axios.get(
      //     `https://content.guardianapis.com/search?q=${search || "latest"}&section=${category}&from-date=${date}&api-key=${API_KEYS.guardian}`
      //   );
      //   console.log('Guardian Response:', guardianRes.data);

      const nytimesRes = await axios.get(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${
          search || "latest"
        }&api-key=${API_KEYS.nytimes}`
      );

      //   https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=yourkey

      console.log("NYTimes Response:", nytimesRes.data.response.docs);

      setArticles([
        ...newsapiRes.data.articles,
        // ...guardianRes.data.response.results,
        ...nytimesRes.data.response.docs,
      ]);
    } catch (error) {
      console.error("Error fetching news", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">News Aggregator</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search articles..."
        className="border p-2 w-full mb-4"
      />
      <input
        type="text"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Enter source..."
        className="border p-2 w-full mb-4"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">All Categories</option>
        <option value="business">Business</option>
      </select>
      <button
        onClick={fetchNews}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>
      {loading ? (
        <p className="text-gray-600">Loading articles...</p>
      ) : (
        <ul className="mt-4">
          {articles.map((article, index) => (
            <li key={index} className="mb-2 border-b pb-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                {article.title || article.headline?.main}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsAggregator;
