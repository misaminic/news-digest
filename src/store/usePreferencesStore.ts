import { create } from 'zustand'

export type PreferencesState = {
  topics: string[]
  addTopic: (topic: string) => void
  removeTopic: (topic: string) => void
  clearTopics: () => void
}

export const usePreferencesStore = create<PreferencesState>()(set => ({
  topics: [],
  addTopic: (topic: string) => {
    console.log('Store: addTopic called with:', topic)
    set(state => {
      if (state.topics.includes(topic)) {
        console.log('Store: Topic already exists, not adding')
        return state
      }
      const newTopics = [...state.topics, topic]
      console.log('Store: New topics array:', newTopics)
      return { topics: newTopics }
    })
  },
  removeTopic: (topic: string) => {
    console.log('Store: removeTopic called with:', topic)
    set(state => {
      const newTopics = state.topics.filter(t => t !== topic)
      console.log('Store: New topics array after removal:', newTopics)
      return { topics: newTopics }
    })
  },
  clearTopics: () => {
    console.log('Store: clearTopics called')
    set({ topics: [] })
  },
}))
