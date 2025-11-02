import type { Article, AnalysisResult } from '../types/ArticleDTO'

export const fetchArticles = async (topics: string[]): Promise<Article[]> => {
  if (!topics || topics.length === 0) {
    throw new Error('No topics selected')
  }

  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${topics.join(' OR ')}&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
  )

  if (!res.ok) throw new Error('Failed to fetch articles')

  const data = await res.json()
  return data.articles
}

export async function analyzeTone(text: string): Promise<AnalysisResult> {
  const prompt = `Analyze the emotional tone of the following text and provide a brief explanation. Give estimation in percentage how likely is it that the content is true and make a nice and concise summary of the article. Respond ONLY in JSON format with this exact structure:
    {
      "truthPercentage": 75,
      "emotion": "positive/negative/neutral/mixed",
      "explanation": "Brief explanation of the emotional tone",
      "summary": "Article summary, its essence explained as best as possible in as least sentences as possible"
    }
    
    Note: truthPercentage must be a number between 0 and 100 (not a string, no % symbol).
    
    Text to analyze: "${text}"`

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:1b',
        prompt,
        stream: false,
      }),
    })

    if (!res.ok) {
      throw new Error(`AI request failed with status: ${res.status}`)
    }

    const data = await res.json()
    const textResponse = data.response || ''

    // Try to extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        // Ensure truthPercentage is a number (handle string percentages like "75%" or "75")
        if (parsed.truthPercentage !== undefined) {
          const truthValue =
            typeof parsed.truthPercentage === 'string'
              ? parseFloat(parsed.truthPercentage.replace('%', '').trim()) || 0
              : Number(parsed.truthPercentage) || 0
          parsed.truthPercentage = Math.max(0, Math.min(100, truthValue)) // Clamp between 0-100
        }
        return parsed
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError)
        return {
          truthPercentage: 0,
          emotion: 'unknown',
          explanation: 'Failed to parse AI response',
          summary: '',
          raw: textResponse,
        }
      }
    }

    // Fallback if no JSON found
    return {
      truthPercentage: 0,
      emotion: 'unknown',
      explanation: 'No valid JSON response found',
      summary: '',
      raw: textResponse,
    }
  } catch (error) {
    console.error('AI analysis error:', error)

    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return {
          truthPercentage: 0,
          emotion: 'error',
          explanation:
            "Ollama server not found. Please make sure Ollama is running and the model 'gemma3:1b' is available.",
          summary: '',
          raw: error.message,
        }
      } else if (error.message.includes('fetch')) {
        return {
          truthPercentage: 0,
          emotion: 'error',
          explanation:
            'Cannot connect to Ollama server. Please check if Ollama is running on localhost:11434.',
          summary: '',
          raw: error.message,
        }
      }
    }

    return {
      truthPercentage: 0,
      emotion: 'error',
      explanation: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      summary: '',
      raw: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
