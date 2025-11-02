import { usePreferencesStore } from '../store/usePreferencesStore'
import type { PreferencesState } from '../store/usePreferencesStore'

export default function Preferences() {
  const { topics, addTopic, removeTopic, clearTopics } = usePreferencesStore(
    (state: PreferencesState) => state
  )

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-4xl mx-auto" style={{ padding: '40px 24px' }}>
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
              ⚙️ Preferences
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', margin: 0, padding: 0 }}>
              Customize your news feed by selecting topics of interest
            </p>
          </div>
        </div>

        {/* Topics Selection Section */}
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            border: '2px solid #475569',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#f1f5f9',
                margin: 0,
                padding: 0,
              }}
            >
              Select Your Topics
            </h2>
            {topics.length > 0 && (
              <button
                onClick={clearTopics}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '2px solid #ef4444',
                  backgroundColor: '#7f1d1d',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#991b1b'
                  e.currentTarget.style.borderColor = '#dc2626'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#7f1d1d'
                  e.currentTarget.style.borderColor = '#ef4444'
                }}
              >
                Clear All
              </button>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
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
                  onChange={() => {}}
                />
                {topic}
              </label>
            ))}
          </div>

          {/* Selected Topics Display */}
          {topics.length > 0 && (
            <div
              style={{
                marginTop: '40px',
                paddingTop: '32px',
                borderTop: '2px solid #475569',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1e3a8a',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  padding: '24px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#bfdbfe',
                    marginBottom: '8px',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {topics.length} Topic{topics.length !== 1 ? 's' : ''} Selected:
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#93c5fd',
                    fontWeight: '600',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {topics.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
