# Local Setup & Run Guide

Follow these steps to get ResearchOS running on your local machine for development.

## 📋 Prerequisites
- **Node.js**: v18 or later.
- **npm**: v9 or later.
- **Convex Account**: [Sign up here](https://convex.dev).
- **Clerk Account**: [Sign up here](https://clerk.dev).

## 🛠️ Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ResearchOS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Convex
Initialize your Convex project:
```bash
npx convex dev
```
This will:
- Prompt you to log in.
- Create a new project.
- Automatically generate a `.env.local` file with `NEXT_PUBLIC_CONVEX_URL`.

### 4. Setup Authentication (Clerk)
1. Creating a new application in the [Clerk Dashboard](https://dashboard.clerk.dev).
2. Copy your **Publishable Key** and **Secret Key**.
3. Add them to your `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 5. Setup AI APIs
Add your AI keys to the **Convex Dashboard** (Settings -> Environment Variables):
- `GROQ_API_KEY`: Get from [Groq Cloud](https://console.groq.com).
- `TAVILY_API_KEY`: Get from [Tavily AI](https://tavily.com).

### 6. Run the Project
Start the Next.js development server:
```bash
npm run dev
```

The application will now be available at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Common Commands
- `npm run dev`: Starts the Next.js dev server.
- `npx convex dev`: Starts the Convex dev server (syncs backend changes).
- `npx convex deploy`: Deploys backend to production.
- `npm run build`: Build the Next.js production bundle.
