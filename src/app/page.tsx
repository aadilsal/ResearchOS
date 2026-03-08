import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function LandingPage() {
  return (
    <main className="dark min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Footer or more sections could go here */}
      <footer className="py-20 px-6 border-t border-white/5 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-foreground">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">R</div>
          <span>ResearchOS</span>
        </div>
        <p>&copy; 2024 ResearchOS AI Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}
