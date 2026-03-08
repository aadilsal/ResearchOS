import { StateGraph, Annotation } from "@langchain/langgraph";
import { planResearch } from "./planner";
import { performSearch } from "./search";
import { summarizeResults } from "./reader";
import { analyzeInsights } from "./analyzer";

// Define the state of our research graph
export interface ResearchStateProps {
  objective: string;
  projectId: string;
  citationStyle: string;
  citationCount: number;
  researchDepth: "brief" | "standard" | "comprehensive";
  tasks: string[]; // These are the task descriptions/queries
  taskIds: string[]; // These correspond to Convex IDs
  results: string[];
  insights: string;
  report: string;
  status: string;
}

const ResearchState = Annotation.Root({
  objective: Annotation<string>(),
  projectId: Annotation<string>(),
  citationStyle: Annotation<string>(),
  citationCount: Annotation<number>(),
  researchDepth: Annotation<string>(),
  tasks: Annotation<string[]>(),
  taskIds: Annotation<string[]>(),
  results: Annotation<string[]>(),
  insights: Annotation<string>(),
  report: Annotation<string>(),
  status: Annotation<string>(),
});

// We'll pass callbacks for real-time updates to the database
export type UpdateCallback = (taskId: string, status: "pending" | "running" | "completed" | "failed", output?: { results: unknown[] }) => Promise<void>;
export type ProjectStatusCallback = (status: "idle" | "planning" | "researching" | "reading" | "analyzing" | "completed" | "failed", error?: string) => Promise<void>;
export type TaskCreateCallback = (type: string, input: { query: string }) => Promise<string>;
let callbacks: {
  updateTask?: UpdateCallback;
  updateProject?: ProjectStatusCallback;
  createTask?: TaskCreateCallback;
} = {};

const TIMEOUT_MS = 60000; // 60 seconds per node

async function withTimeout<T>(promise: Promise<T>, description: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout: ${description} exceeded ${TIMEOUT_MS}ms`));
    }, TIMEOUT_MS);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  }) as Promise<T>;
}

// Define nodes
async function plannerNode(state: typeof ResearchState.State) {
  try {
    console.log("Planning research for:", state.objective);
    if (callbacks.updateProject) await callbacks.updateProject("planning");
    
    const plan = await withTimeout(planResearch(state.objective), "Planning phase");
    
    const taskIds: string[] = [];
    if (callbacks.createTask) {
      for (const task of plan.tasks) {
        const id = await callbacks.createTask("search", { query: task });
        taskIds.push(id);
      }
    }

    return { 
      tasks: plan.tasks,
      taskIds,
      status: "searching"
    };
  } catch (error) {
    console.error("Planner failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Planner phase failed";
    if (callbacks.updateProject) await callbacks.updateProject("failed", errorMessage);
    throw error;
  }
}

async function searchNode(state: typeof ResearchState.State) {
  try {
    console.log("Searching for tasks:", state.tasks);
    if (callbacks.updateProject) await callbacks.updateProject("researching");
    
    const results: string[] = [];
    for (let i = 0; i < state.tasks.length; i++) {
      const task = state.tasks[i];
      const taskId = state.taskIds[i];
      
      try {
        if (callbacks.updateTask && taskId) {
          await callbacks.updateTask(taskId, "running");
        }

        const searchResults = await withTimeout(performSearch(task), `Searching for: ${task}`);
        const summary = searchResults
          .slice(0, 3)
          .map(r => `Source: ${r.title} (${r.url})\nContent: ${r.content}`)
          .join("\n\n");
        
        if (callbacks.updateTask && taskId) {
          await callbacks.updateTask(taskId, "completed", { results: searchResults });
        }

        results.push(`Task: ${task}\n\nSearch Findings:\n${summary}`);
      } catch (taskError) {
        console.error(`Task failed: ${task}`, taskError);
        if (callbacks.updateTask && taskId) {
          await callbacks.updateTask(taskId, "failed");
        }
        results.push(`Task: ${task}\n\nSearch Findings: [FAILED TO RETRIEVE]`);
      }
    }

    return { 
      results,
      status: "reading"
    };
  } catch (error) {
    console.error("Searcher node failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Searcher phase failed";
    if (callbacks.updateProject) await callbacks.updateProject("failed", errorMessage);
    throw error;
  }
}

async function readerNode(state: typeof ResearchState.State) {
  try {
    console.log("Reading and summarizing search results...");
    if (callbacks.updateProject) await callbacks.updateProject("reading");
    
    const insights = await withTimeout(summarizeResults(state.objective, state.results), "Reading phase");
    return {
      insights,
      status: "analyzing"
    };
  } catch (error) {
    console.error("Reader failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Reader phase failed";
    if (callbacks.updateProject) await callbacks.updateProject("failed", errorMessage);
    throw error;
  }
}

async function analysisNode(state: typeof ResearchState.State) {
  try {
    console.log(`Analyzing insights and generating a ${state.researchDepth} report with ~${state.citationCount} ${state.citationStyle} citations...`);
    if (callbacks.updateProject) await callbacks.updateProject("analyzing");
    
    const report = await withTimeout(analyzeInsights(
      state.objective, 
      state.insights, 
      state.citationStyle,
      state.citationCount,
      state.researchDepth
    ), "Final Analysis phase");
    return { 
      report,
      status: "completed"
    };
  } catch (error) {
    console.error("Analyzer failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Analyzer phase failed";
    if (callbacks.updateProject) await callbacks.updateProject("failed", errorMessage);
    throw error;
  }
}

// Build the graph
export function createResearchGraph() {
  const workflow = new StateGraph(ResearchState)
    .addNode("planner", plannerNode)
    .addNode("searcher", searchNode)
    .addNode("reader", readerNode)
    .addNode("analyzer", analysisNode)
    .addEdge("__start__", "planner")
    .addEdge("planner", "searcher")
    .addEdge("searcher", "reader")
    .addEdge("reader", "analyzer")
    .addEdge("analyzer", "__end__");

  return workflow.compile();
}

export async function runResearchJob(
  objective: string, 
  projectId: string,
  citationStyle: string = "APA",
  citationCount: number = 5,
  researchDepth: "brief" | "standard" | "comprehensive" = "standard",
  providedCallbacks?: typeof callbacks
) {
  if (providedCallbacks) callbacks = providedCallbacks;
  
  const graph = createResearchGraph();
  const initialState = {
    objective,
    projectId,
    citationStyle,
    citationCount,
    researchDepth,
    tasks: [],
    taskIds: [],
    results: [],
    insights: "",
    report: "",
    status: "starting",
  };
  
  const finalState = await graph.invoke(initialState);
  return finalState;
}
