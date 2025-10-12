import { usePreferencesStore } from '../store/usePreferencesStore'
import { useNewsStore } from '../store/newsStore'
import type { PreferencesState } from '../store/usePreferencesStore'

export default function Digest() {
  const topics = usePreferencesStore((state: PreferencesState) => state.topics)
  const { articles, fetchNews } = useNewsStore()

  return (
    <div>
      <h2>Digest Page</h2>
      <button onClick={() => fetchNews(topics)}>Fetch News</button>
      
      <ul>
        {articles?.map((a, i) => (
          <li key={i}>
            <a href={a.url} target="_blank" rel="noopener noreferrer">
              {a.title}
            </a>{' '}
            ({a.source})
          </li>
        ))}
      </ul>
    </div>
  )
}
