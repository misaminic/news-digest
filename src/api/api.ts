export const fetchArticles = async(topics: string[]) => {
    if (!topics || topics.length === 0) {
        throw new Error("No topics selected");
      }

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${topics.join(" OR ")}&pageSize=10&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
    );
  
    if (!res.ok) throw new Error("Failed to fetch articles");
  
    const data = await res.json();
    return data.articles;
  }
  