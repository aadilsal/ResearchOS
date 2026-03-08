# Vercel Deployment Guide

Deploying ResearchOS to Vercel requires connecting your Next.js frontend with your Convex backend.

## 🚀 Deployment Steps

### 1. Convex Deployment
First, ensure your Convex backend is ready for production:
1. Run `npx convex deploy` to push your backend logic to the Convex production environment.
2. Copy your **Convex Deployment URL** (e.g., `https://happy-otter-123.convex.cloud`).

### 2. Vercel Project Setup
1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Log in to [Vercel](https://vercel.com) and click **"Add New"** -> **"Project"**.
3. Import your ResearchOS repository.

### 3. Environment Variables
In the Vercel dashboard, add the following environment variables:

| Variable | Source |
| :--- | :--- |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex Deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard -> API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard -> API Keys |

### 4. Convex environment variables
You also need to set secret keys on the **Convex Dashboard** (Settings -> Environment Variables):
- `GROQ_API_KEY`: Your Groq Cloud API Key.
- `TAVILY_API_KEY`: Your Tavily API Key.

### 5. Finalize
1. Click **Deploy**.
2. Once the build is complete, you'll receive a production URL (e.g., `research-os.vercel.app`).
3. **Crucial**: Go to your Clerk Dashboard and add your new production URL to the **"Allowed Redirect URIs"** section.

## 🛠️ Edge Functions & Optimization
ResearchOS uses Next.js App Router and server-side components. Vercel automatically optimizes these for performance. If you encounter timeouts with Groq agents, consider switching specific agent functions to Edge Runtime in `convex/orchestrator.ts` if needed (though current timeout logic handles standard lambdas well).
