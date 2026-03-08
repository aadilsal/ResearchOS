import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

export async function planResearch(objective: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables. Please add it to your Convex dashboard.");
  }

  const model = new ChatGroq({
    apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const schema = z.object({
    tasks: z.array(z.string()).describe("A list of 3-5 tactical research tasks."),
  });

  const structuredModel = model.withStructuredOutput(schema);

  const prompt = `You are a Research Planner Agent. Your goal is to break down a complex research objective into a small set of actionable tasks.
  
  Objective: ${objective}
  
  Each task should be a specific instruction for a Search Agent to find data or for an Analysis Agent to process specific aspects of the research.
  Produce exactly 3 to 5 clear, high-quality research tasks.`;

  try {
    console.log(`Planning research for: ${objective}`);
    const result = await structuredModel.invoke(prompt);
    return result;
  } catch (error) {
    console.error("Planner Agent failed:", error);
    // Fallback if structured output fails
    return {
      tasks: [
        "Search for general industry reports",
        "Identify major competitors",
        "Look for recent market trends",
      ]
    };
  }
}
