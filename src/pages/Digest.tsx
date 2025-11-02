import { useState } from 'react'
import { usePreferencesStore } from '../store/usePreferencesStore'
import { useQuery } from '@tanstack/react-query'
import type { PreferencesState } from '../store/usePreferencesStore'
import { fetchArticles, analyzeTone } from '../api/api'
import type { Article, AnalysisResult } from '../types/ArticleDTO'


export default function Digest() {
  const { topics, addTopic, removeTopic } = usePreferencesStore(
    (state: PreferencesState) => state
  )
  const [analysis, setAnalysis] = useState<Record<string, AnalysisResult>>({})
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['articles', [...topics].sort().join(',')],
    queryFn: () => fetchArticles([...topics]),
    enabled: topics.length > 0,
  })
  
  const availableTopics = [
    'Technology',
    'Business',
    'Science',
    'Entertainment',
    'Health',
    'Sports',
    'Politics',
    'Other',
  ]

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
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-5xl mx-auto" style={{ padding: '40px 24px' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              border: '2px solid #475569',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              padding: '32px',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#f1f5f9',
                marginBottom: '8px',
                margin: 0,
                padding: 0,
              }}
            >
              📰 News Digest
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, padding: 0 }}>
              Select topics to view and analyze articles
            </p>
          </div>
        </div>

        {/* Topic Selector */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              border: '2px solid #475569',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              padding: '32px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#f1f5f9',
                marginBottom: '24px',
                margin: 0,
                padding: 0,
              }}
            >
              Select Topics
            </h2>            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-start' }}>
              {availableTopics.map(topic => (
                <label
                  key={topic}
                  onClick={() => {
                    if (topics.includes(topic)) {
                      removeTopic(topic)
                    } else {
                      addTopic(topic)
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '2px solid',
                    transition: 'all 0.2s',
                    backgroundColor: topics.includes(topic) ? '#3b82f6' : '#334155',
                    color: topics.includes(topic) ? '#ffffff' : '#cbd5e1',
                    borderColor: topics.includes(topic) ? '#3b82f6' : '#475569',
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={topics.includes(topic)}
                    onChange={() => { }}
                  />
                  {topic}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  border: '2px solid #475569',
                  padding: '32px',
                }}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#334155',
                      borderRadius: '12px',
                      flexShrink: 0,
                    }}
                  ></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div
                      style={{
                        height: '20px',
                        backgroundColor: '#334155',
                        borderRadius: '4px',
                        width: '75%',
                      }}
                    ></div>
                    <div
                      style={{
                        height: '16px',
                        backgroundColor: '#334155',
                        borderRadius: '4px',
                        width: '100%',
                      }}
                    ></div>
                    <div
                      style={{
                        height: '16px',
                        backgroundColor: '#334155',
                        borderRadius: '4px',
                        width: '85%',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div
            style={{
              backgroundColor: '#7f1d1d',
              border: '2px solid #991b1b',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ color: '#fca5a5', fontSize: '16px', fontWeight: '500', margin: 0 }}>
              Error: {(error as Error).message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!articles || articles.length === 0) && topics.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 32px',
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              border: '2px solid #475569',
            }}
          >
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>
              No articles found. Try different topics.
            </p>
          </div>
        )}

        {/* Debug: Show current topics */}
        {/* {articles?.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 32px',
              backgroundColor: '#1e293b',
              borderRadius: '16px',
              border: '2px solid #475569',
            }}
          >
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>
              Select at least one topic to view articles
            </p>
          </div>
        )} */}

        {/* Articles List */}
        {true && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {articles?.map((article: Article, idx: number) => (
              <article
                key={idx}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  border: '2px solid #475569',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '32px' }}>
                  <div
                    className="flex flex-col sm:flex-row"
                    style={{
                      gap: '24px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Image */}
                    {article.urlToImage && (
                      <div
                        className="sm:w-28 sm:h-28 w-full h-28 flex-shrink-0"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        <img
                          src={article.urlToImage}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            border: '2px solid #475569',
                          }}
                          onError={e => {
                            ; (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
                      {/* Title and Description Box */}
                      <div
                        style={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          border: '2px solid #334155',
                          padding: '20px',
                        }}
                      >
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#f1f5f9',
                            marginBottom: '12px',
                            margin: 0,
                            padding: 0,
                            lineHeight: '1.4',
                          }}
                        >
                          {article.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '15px',
                            color: '#cbd5e1',
                            lineHeight: '1.6',
                            margin: 0,
                            padding: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {article.description}
                        </p>
                      </div>

                      {/* Meta Info Box */}
                      <div
                        style={{
                          backgroundColor: '#1e3a8a',
                          borderRadius: '12px',
                          border: '2px solid #3b82f6',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '14px',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              color: '#bfdbfe',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span style={{ fontWeight: '600' }}>{article.source.name}</span>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#93c5fd',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Read Article →
                          </a>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        <button
                          onClick={() =>
                            handleAnalyze(String(idx), article.description || article.title)
                          }
                          disabled={analyzingId === String(idx)}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            border: '2px solid',
                            cursor: analyzingId === String(idx) ? 'not-allowed' : 'pointer',
                            backgroundColor: analyzingId === String(idx) ? '#334155' : '#3b82f6',
                            color: analyzingId === String(idx) ? '#64748b' : '#ffffff',
                            borderColor: analyzingId === String(idx) ? '#475569' : '#2563eb',
                            transition: 'all 0.2s',
                          }}
                        >
                          {analyzingId === String(idx) ? 'Analyzing...' : 'Analyze with AI'}
                        </button>
                      </div>

                      {/* AI Analysis Section */}
                      {analysis[String(idx)] && (
                        <div
                          style={{
                            background: 'linear-gradient(to bottom right, #1e1b4b, #312e81)',
                            borderRadius: '12px',
                            border: '2px solid #6366f1',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '4px',
                            }}
                          >
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#818cf8',
                                borderRadius: '50%',
                              }}
                            ></div>
                            <h4
                              style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#f1f5f9',
                                margin: 0,
                                padding: 0,
                              }}
                            >
                              AI Analysis
                            </h4>
                          </div>

                          {/* Credibility Score Box */}
                          <div
                            style={{
                              backgroundColor: '#0f172a',
                              borderRadius: '12px',
                              border: '2px solid #475569',
                              padding: '20px',
                            }}
                          >
                            <div
                              className="flex flex-col sm:flex-row items-center"
                              style={{
                                gap: '16px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                                  Credibility:
                                </span>
                                <span
                                  style={{
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color:
                                      analysis[String(idx)].truthPercentage >= 75
                                        ? '#4ade80'
                                        : analysis[String(idx)].truthPercentage >= 50
                                          ? '#fbbf24'
                                          : '#f87171',
                                  }}
                                >
                                  {Math.round(analysis[String(idx)].truthPercentage)}%
                                </span>
                              </div>
                              <div
                                className="flex-1 sm:max-w-xs"
                                style={{
                                  height: '12px',
                                  backgroundColor: '#334155',
                                  borderRadius: '6px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    height: '100%',
                                    width: `${analysis[String(idx)].truthPercentage}%`,
                                    backgroundColor:
                                      analysis[String(idx)].truthPercentage >= 75
                                        ? '#4ade80'
                                        : analysis[String(idx)].truthPercentage >= 50
                                          ? '#fbbf24'
                                          : '#f87171',
                                    borderRadius: '6px',
                                  }}
                                ></div>
                              </div>
                              <span
                                style={{
                                  fontSize: '13px',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  border: '2px solid',
                                  backgroundColor:
                                    analysis[String(idx)].emotion === 'positive'
                                      ? '#064e3b'
                                      : analysis[String(idx)].emotion === 'negative'
                                        ? '#7f1d1d'
                                        : analysis[String(idx)].emotion === 'neutral'
                                          ? '#1e293b'
                                          : '#78350f',
                                  color:
                                    analysis[String(idx)].emotion === 'positive'
                                      ? '#6ee7b7'
                                      : analysis[String(idx)].emotion === 'negative'
                                        ? '#fca5a5'
                                        : analysis[String(idx)].emotion === 'neutral'
                                          ? '#cbd5e1'
                                          : '#fcd34d',
                                  borderColor:
                                    analysis[String(idx)].emotion === 'positive'
                                      ? '#10b981'
                                      : analysis[String(idx)].emotion === 'negative'
                                        ? '#ef4444'
                                        : analysis[String(idx)].emotion === 'neutral'
                                          ? '#475569'
                                          : '#f59e0b',
                                }}
                              >
                                {analysis[String(idx)].emotion}
                              </span>
                            </div>
                          </div>

                          {/* Analysis Text Box */}
                          {analysis[String(idx)].explanation && (
                            <div
                              style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                border: '2px solid #475569',
                                padding: '20px',
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  color: '#cbd5e1',
                                  marginBottom: '12px',
                                  margin: 0,
                                  padding: 0,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                }}
                              >
                                Analysis
                              </p>
                              <p
                                style={{
                                  fontSize: '15px',
                                  color: '#e2e8f0',
                                  lineHeight: '1.6',
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {analysis[String(idx)].explanation}
                              </p>
                            </div>
                          )}

                          {/* Summary Text Box */}
                          {analysis[String(idx)].summary && (
                            <div
                              style={{
                                backgroundColor: '#0f172a',
                                borderRadius: '12px',
                                border: '2px solid #7c3aed',
                                padding: '20px',
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  color: '#c4b5fd',
                                  marginBottom: '12px',
                                  margin: 0,
                                  padding: 0,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px',
                                }}
                              >
                                Summary
                              </p>
                              <p
                                style={{
                                  fontSize: '15px',
                                  color: '#e2e8f0',
                                  lineHeight: '1.6',
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {analysis[String(idx)].summary}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
