import { create } from 'zustand'

export type PreferencesState = {
  topics: string[]
  addTopic: (topic: string) => void
  removeTopic: (topic: string) => void
  clearTopics: () => void
}

export const usePreferencesStore = create<PreferencesState>()(set => ({
  topics: [],
  addTopic: (topic: string) => set(state => ({ topics: [...state.topics, topic] })),
  removeTopic: (topic: string) => set(state => ({ topics: state.topics.filter(t => t !== topic) })),
  clearTopics: () => set({ topics: [] }),
}))
