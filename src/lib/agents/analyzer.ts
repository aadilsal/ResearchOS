import { ChatGroq } from "@langchain/groq";

export async function analyzeInsights(
  objective: string, 
  insights: string, 
  citationStyle: string = "APA",
  citationCount: number = 5,
  researchDepth: string = "standard"
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables. Please add it to your Convex dashboard.");
  }

  const model = new ChatGroq({
    apiKey,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
  });

  const prompt = `You are a Senior Strategic Researcher. Your goal is to synthesize raw research insights into a professional, high-impact research report.
  
  RESEARCH OBJECTIVE: ${objective}
  RAW INSIGHTS: ${insights}
  CITATION STYLE: ${citationStyle}
  TARGET CITATION COUNT: ${citationCount}
  RESEARCH DEPTH: ${researchDepth}

  COMPLIANCE & FORMATTING RULES:
  1. Use Markdown for structured formatting. You MUST leave a clean blank empty line before and after every heading, paragraph, and list element.
  2. Organize the report into the following logical sections:
     # [Professional Report Title]

     ## Executive Summary
     (High-level findings here)

     ## Methodology
     (Brief overview of research approach)

     ## Detailed Analysis & Findings 
     (The core content with clear subheadings, tables, and lists)

     ## Strategic Recommendations
     (Actionable takeaways)

     ## Works Cited
     (Formatted in ${citationStyle} style)

  3. INTEGRITY: Aim for approximately ${citationCount} high-quality citations. Every major factual claim MUST be followed by an in-text citation (e.g., [Source Name, Year] or similar for ${citationStyle}). 
  4. DEPTH: The report should be ${researchDepth} in detail. 
     - "brief" = Concise, 1-2 pages equivalent, high-level bullets.
     - "standard" = Balanced, 3-5 pages equivalent, thorough analysis.
     - "comprehensive" = Exhaustive, 7+ pages equivalent, deep technical/market dive.
  5. TONAL QUALITY: Use professional, objective, and analytical language. 
  6. VISUALS: Use bullet points, bold text for emphasis, and Markdown tables if the data warrants it.

  Ensure the final report is exhaustive, authoritative, beautifully spaced, and ready for an executive audience.`;

  try {
    console.log(`Generating a ${researchDepth} report with ~${citationCount} ${citationStyle} citations for: ${objective}`);
    const result = await model.invoke(prompt);
    return result.content as string;
  } catch (error) {
    console.error("Analyzer Agent synthesis failed:", error);
    throw error;
  }
}
