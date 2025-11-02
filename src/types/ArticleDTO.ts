export type Article = {
  title: string
  description: string
  url: string
  urlToImage?: string
  source: {
    name: string
  }
  publishedAt: string
  author?: string
  content?: string
}

export type AnalysisResult = {
  truthPercentage: number
  emotion: string
  explanation: string
  summary: string
  raw?: string
}
