import { usePreferencesStore } from "../store/usePreferencesStore"

export default function Preferences () {

    const { topics, addTopic, removeTopic } = usePreferencesStore()
    const availableTopics = ['Technology', 'Business', 'Science', 'Entertainment', 'Health', 'Sports', 'Politics', 'Other']
    

    return (
        <div>
        <h2>Preferences Page</h2>
        <ul>
          {availableTopics.map((topic) => (
            <li key={topic}>
              <label>
                <input
                  type="checkbox"
                  checked={topics.includes(topic)}
                  onChange={(e) =>
                    e.target.checked ? addTopic(topic) : removeTopic(topic)
                  }
                />
                {topic}
              </label>
            </li>
          ))}
        </ul>
  
        <p>Selected topics: {topics.join(', ') || 'None'}</p>
      </div>
    )
}