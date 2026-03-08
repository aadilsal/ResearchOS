import { tavily } from "@tavily/core";

export async function performSearch(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set in environment variables. Please add it to your Convex dashboard.");
  }
  const tvly = tavily({ apiKey });
  console.log(`Searching Tavily for: ${query}`);
  
  try {
    const response = await tvly.search(query, {
      searchDepth: "basic",
      maxResults: 5,
    });
    
    return response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
      score: result.score,
    }));
  } catch (error) {
    console.error("Tavily search failed:", error);
    return [];
  }
}
