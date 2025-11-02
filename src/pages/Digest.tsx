import { useState } from "react"
import { usePreferencesStore } from "../store/usePreferencesStore"
import { useQuery } from "@tanstack/react-query"
import type { PreferencesState } from "../store/usePreferencesStore"
import { fetchArticles, analyzeTone } from "../api/api"
import type { Article, AnalysisResult } from "../types/ArticleDTO"

export default function Digest() {
  const { topics, addTopic, removeTopic } = usePreferencesStore((state: PreferencesState) => state)
  const [analysis, setAnalysis] = useState<Record<string, AnalysisResult>>({})
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const { data: articles, isLoading, isError, error } = useQuery({
    queryKey: ["articles", topics],
    queryFn: () => fetchArticles(topics),
    enabled: topics.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  const availableTopics = [
    "Technology",
    "Business",
    "Science",
    "Entertainment",
    "Health",
    "Sports",
    "Politics",
    "Other",
  ]

  async function handleAnalyze(articleId: string, text: string) {
    try {
      setAnalyzingId(articleId)
      const result = await analyzeTone(text)
      setAnalysis((prev) => ({ ...prev, [articleId]: result }))
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">Personalized News Digest</h2>

      {/* Preferences / Topic Selector */}
      <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Topics</h3>
        <div className="flex flex-wrap gap-3">
          {availableTopics.map((topic) => (
            <label
              key={topic}
              className={`cursor-pointer px-4 py-2 rounded-full border transition-colors ${
                topics.includes(topic)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={topics.includes(topic)}
                onChange={(e) =>
                  e.target.checked ? addTopic(topic) : removeTopic(topic)
                }
              />
              {topic}
            </label>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Selected topics:{" "}
          <span className="font-medium">
            {topics.length > 0 ? topics.join(", ") : "None"}
          </span>
        </p>
      </div>

      {/* Articles Section */}
      {isLoading && <p>Loading articles...</p>}
      {isError && (
        <p className="text-red-600">Error: {(error as Error).message}</p>
      )}
      {!isLoading && (!articles || articles.length === 0) && (
        <p>No articles found.</p>
      )}

      {articles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article, idx: number) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt="Article thumbnail"
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              )}

              <h3 className="font-semibold text-lg leading-tight mb-2">
                {article.title}
              </h3>

              <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                {article.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{article.source.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block mb-3"
              >
                Read original →
              </a>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                onClick={() =>
                  handleAnalyze(String(idx), article.description || article.title)
                }
                disabled={analyzingId === String(idx)}
              >
                {analyzingId === String(idx)
                  ? "Analyzing..."
                  : "Analyze Tone"}
              </button>

              {analysis[String(idx)] && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-800">
                      AI Analysis:
                    </span>
                    <span>
                      Truth: {analysis[String(idx)].truthPercentage}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis[String(idx)].emotion === "positive"
                          ? "bg-green-100 text-green-800"
                          : analysis[String(idx)].emotion === "negative"
                          ? "bg-red-100 text-red-800"
                          : analysis[String(idx)].emotion === "neutral"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Tone: {analysis[String(idx)].emotion}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {analysis[String(idx)].explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
