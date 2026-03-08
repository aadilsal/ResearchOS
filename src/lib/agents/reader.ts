import { ChatGroq } from "@langchain/groq";

export async function summarizeResults(objective: string, searchResults: string[]) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables. Please add it to your Convex dashboard.");
  }

  const model = new ChatGroq({
    apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });
  console.log(`Summarizing ${searchResults.length} search results for objective: ${objective}`);
  
  if (searchResults.length === 0) {
    return "No search results found to summarize.";
  }

  const combinedResults = searchResults.join("\n\n---\n\n");
  
  const prompt = `You are a Research Analyst Agent. Your goal is to extract key facts, statistics, and insights from the provided search results to address the research objective.
  
  Objective: ${objective}
  
  Search Results:
  ${combinedResults}
  
  Please provide a structured summary including:
  1. Key Findings (facts and data points)
  2. Important Trends or Patterns
  3. Potential Competitors or Key Players (if applicable)
  4. Any gaps in information that need further investigation.
  
  Keep your summary concise, objective, and well-organized. Use markdown for formatting.`;

  try {
    const response = await model.invoke(prompt);
    return response.content as string;
  } catch (error) {
    console.error("Reader Agent summarization failed:", error);
    return "Failed to summarize search results.";
  }
}
