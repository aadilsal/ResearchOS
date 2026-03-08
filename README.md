# ResearchOS 🚀
**Autonomous AI research at your fingertips.**

ResearchOS is a high-performance, multi-tenant SaaS platform that leverages autonomous AI agents to transform core-competency research into a streamlined, automated experience. Built with **Next.js 14**, **Convex**, and **LangGraph**, it transforms complex objectives into professional intelligence reports in minutes.

---

## ✨ Key Features
- **🤖 Autonomous Agent Cluster**: 
    - **Planner**: Dynamically breaks down objectives.
    - **Searcher**: Multi-source web navigation via Tavily.
    - **Reader**: Facts extraction and factual synthesis.
    - **Analyzer**: Generates boardroom-ready reports.
- **💎 Premium UI/UX**: Ultra-fast, glassmorphic dashboard with real-time agent tracking.
- **🛡️ Multi-tenant Security**: Robust data isolation and secure authentication via Clerk.
- **⚡ Real-time Feedback**: Live progress visualization and terminal output for every research job.
- **💰 Resource Monitoring**: Integrated credit system and usage analytics.

---

## 📂 Documentation
For detailed information on how to build, deploy, and manage ResearchOS, please refer to the following guides:

- **[Technical Blueprint](./documents/blueprint.md)**: Deep dive into the architecture, schema, and AI orchestration logic.
- **[Local Setup & Run Guide](./documents/setup.md)**: Step-by-step instructions to get the project running locally.
- **[Vercel Deployment Guide](./documents/deployment.md)**: How to push ResearchOS to production on Vercel and Convex.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Backend**: Convex Real-time Database
- **AI Orchestration**: LangGraph (LangChain)
- **LLM**: Groq (Llama-3-70b)
- **Search Engine**: Tavily API
- **Authentication**: Clerk
- **UI Components**: shadcn/ui + Tailwind CSS

---

## 🏁 Getting Started
Quick start for local development:
1. `npm install`
2. `npx convex dev` (Setup your Convex project)
3. Set up your `.env.local` with Clerk, Groq, and Tavily keys.
4. `npm run dev`

Visit [Local Setup Guide](./documents/setup.md) for full details.
