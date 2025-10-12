import { create } from 'zustand'

type Article = {
  title: string
  description: string
  url: string
  source: string
}

type NewsState = {
  articles: Article[]
  fetchNews: (topics: string[]) => Promise<void>
}

const apiKey = import.meta.env.VITE_NEWS_API_KEY

export const useNewsStore = create<NewsState>((set) => ({
  articles: [],
  fetchNews: async (topics) => {
    const query = topics.join(' OR ')
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&pageSize=10&apiKey=${apiKey}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      set({ articles: data.articles.map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source.name
      })) })
    } catch (err) {
      console.error('Failed to fetch news', err)
    }
  },
}))
