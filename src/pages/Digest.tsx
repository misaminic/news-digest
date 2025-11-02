import { usePreferencesStore } from '../store/usePreferencesStore'
import { useQuery } from '@tanstack/react-query'
import type { PreferencesState } from '../store/usePreferencesStore'
import { fetchArticles, analyzeTone } from '../api/api'
import type { Article, AnalysisResult } from '../types/ArticleDTO'
import { useState } from 'react'

export default function Digest() {
  const topics = usePreferencesStore((state: PreferencesState) => state.topics)
  
  const [analysis, setAnalysis] = useState<Record<string, AnalysisResult>>({})
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const { data: articles, isLoading, isError, error } = useQuery({
    queryKey: ["articles", topics],
    queryFn: () => fetchArticles(topics),
    enabled: topics.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p>Loading articles...</p>
  if (isError) return <p className="text-red-600">Error: {(error as Error).message}</p>
  if (!articles || articles.length === 0) return <p>No articles found.</p>

  async function handleAnalyze(articleId: string, text: string) {
    try {
      setAnalyzingId(articleId)
      const result = await analyzeTone(text)
      setAnalysis(prev => ({ ...prev, [articleId]: result }))
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Digest Page</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article, idx: number) => (
          <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt="Article thumbnail"
                className="w-full h-40 object-cover rounded mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-lg leading-tight">{article.title}</h3>
              
              <p className="text-sm text-gray-700 line-clamp-3">
                {article.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.source.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-block"
              >
                Read original →
              </a>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                onClick={() => handleAnalyze(String(idx), article.description || article.title)}
                disabled={analyzingId === String(idx)}
              >
                {analyzingId === String(idx) ? "Analyzing..." : "Analyze Tone"}
              </button>

              {analysis[String(idx)] && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-blue-800">AI Analysis:</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium`}>
                    <span>
                      Truth percentage: {analysis[String(idx)].truthPercentage}
                    </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysis[String(idx)].emotion === 'positive' ? 'bg-green-100 text-green-800' :
                      analysis[String(idx)].emotion === 'negative' ? 'bg-red-100 text-red-800' :
                      analysis[String(idx)].emotion === 'neutral' ? 'bg-gray-100 text-gray-800' :
                      analysis[String(idx)].emotion === 'mixed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Emotional tone of the artical: {analysis[String(idx)].emotion}
                    </span>
                  </div>
                  <div>Content summary:</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                   {analysis[String(idx)].explanation}
                  </div>
                  {analysis[String(idx)].raw && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Raw response</summary>
                      <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                        {analysis[String(idx)].raw}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
