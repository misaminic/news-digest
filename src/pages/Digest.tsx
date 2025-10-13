import { usePreferencesStore } from '../store/usePreferencesStore'
import { useQuery } from '@tanstack/react-query'
import type { PreferencesState } from '../store/usePreferencesStore'
import { fetchArticles } from '../api/api'


export default function Digest() {
  const topics = usePreferencesStore((state: PreferencesState) => state.topics)

  
  const { data: articles, isLoading, isError, error } = useQuery({
    queryKey: ["articles", topics], // cache per set of topics
    queryFn: () => fetchArticles(topics),
    enabled: topics.length > 0,     // don’t fetch if no topics selected
    staleTime: 5 * 60 * 1000,       // 5 minutes fresh
  });

  if (isLoading) {
   return <p>Loading articles...</p>
  }

  if (isError) {
    return <p className="text-red-600">Error: {(error as Error).message}</p>
  } 

  if (!articles || articles.length === 0) {
    return <p>No articles found.</p>
  } 

  return (
    <div>
      <h2>Digest Page</h2>
      {/* <button onClick={() => fetchNews(topics)}>Fetch News</button> */}
      
      <ul>
        {articles?.map((a, i) => (
          <li key={i}>
            <a href={a.url} target="_blank" rel="noopener noreferrer">
              {a.title}
            </a>{' '}
            ({a.source.name})
          </li>
        ))}
      </ul>
    </div>
  )
}
