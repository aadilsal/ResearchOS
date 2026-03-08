"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, ArrowRight, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUser } from "@clerk/nextjs";
import { UsageDashboard } from "@/components/dashboard/UsageDashboard";
import { toast } from "sonner";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";

export default function DashboardPage() {
  const { user } = useUser();
  const tokenIdentifier = user?.id ?? "";
  
  const userData = useQuery(api.users.me, { 
    tokenIdentifier
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [citationStyle, setCitationStyle] = useState<"APA" | "MLA" | "Chicago" | "IEEE" | "Harvard">("APA");
  const [citationCount, setCitationCount] = useState(5);
  const [researchDepth, setResearchDepth] = useState<"brief" | "standard" | "comprehensive">("standard");
  const [projectToDelete, setProjectToDelete] = useState<Id<"projects"> | null>(null);

  const tenant = userData?.tenants?.[0];
  const tenantId = tenant?._id;

  const projects = useQuery(api.projects.listByTenant, 
    tenantId ? { tenantId, tokenIdentifier } : "skip"
  );
  
  const createProject = useMutation(api.projects.create).withOptimisticUpdate((localStore, args) => {
    // Optimistic update for projects list
    const existingProjects = localStore.getQuery(api.projects.listByTenant, { 
      tenantId: args.tenantId, 
      tokenIdentifier: args.tokenIdentifier 
    });
    
    if (existingProjects !== undefined) {
      const optimisticProject = {
        _id: `optimistic` as Id<"projects">,
        _creationTime: 0, // Placeholder
        title: args.title,
        objective: args.objective,
        status: "idle" as const,
        tenantId: args.tenantId,
      };
      localStore.setQuery(api.projects.listByTenant, 
        { tenantId: args.tenantId, tokenIdentifier: args.tokenIdentifier },
        [optimisticProject, ...existingProjects]
      );
    }
  });

  const handleCreate = async () => {
    if (!tenantId) return;
    try {
      const promise = createProject({
        tenantId,
        title,
        objective,
        citationStyle,
        citationCount,
        researchDepth,
        tokenIdentifier,
      });

      toast.promise(promise, {
        loading: 'Initializing research project...',
        success: 'Project created successfully!',
        error: 'Failed to create project.',
      });

      await promise;
      setIsOpen(false);
      setTitle("");
      setObjective("");
    } catch (err) {
      console.error(err);
    }
  };

  const removeProject = useMutation(api.projects.remove).withOptimisticUpdate((localStore, args) => {
    if (!tenantId) return;
    const existingProjects = localStore.getQuery(api.projects.listByTenant, { 
      tenantId, 
      tokenIdentifier: args.tokenIdentifier 
    });
    if (existingProjects) {
      localStore.setQuery(api.projects.listByTenant, 
        { tenantId, tokenIdentifier: args.tokenIdentifier },
        existingProjects.filter(p => p._id !== args.projectId)
      );
    }
  });

  const handleDelete = async () => {
    if (!projectToDelete || !tenantId) return;
    try {
      const promise = removeProject({
        projectId: projectToDelete,
        tokenIdentifier,
      });

      toast.promise(promise, {
        loading: 'Deleting project...',
        success: 'Project deleted successfully!',
        error: 'Failed to delete project.',
      });

      await promise;
    } catch (err) {
      console.error(err);
    } finally {
      setProjectToDelete(null);
    }
  };

  if (!user || userData === undefined) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading ResearchOS...</p>
      </div>
    );
  }

  if (userData === null) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Setting up your professional workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Analytics & Credits */}
      {tenantId && <UsageDashboard tenantId={tenantId} />}

      <div className="flex items-center justify-between border-t border-white/5 pt-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Active Research
          </h2>
          <p className="text-muted-foreground">Monitor and manage your autonomous agents.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button size="lg" className="rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            }
          />
          <DialogContent className="glass shadow-2xl border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Start New Research</DialogTitle>
              <DialogDescription className="text-muted-foreground">Define your research objective and let the agents do the work.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">Project Title</Label>
                <Input 
                  id="title" 
                  className="bg-white/5 border-white/10 focus:border-primary/50"
                  placeholder="e.g. Quantum Computing Startups 2024" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective" className="text-sm font-semibold">Research Objective</Label>
                <Textarea 
                  id="objective" 
                  className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[120px]"
                  placeholder="What exactly do you want the agents to discover?" 
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="citation" className="text-sm font-semibold">Citation Style</Label>
                <Select 
                  value={citationStyle} 
                  onValueChange={(value: "APA" | "MLA" | "Chicago" | "IEEE" | "Harvard" | null) => {
                    if (value) setCitationStyle(value);
                  }}
                >
                  <SelectTrigger id="citation" className="bg-white/5 border-white/10 focus:border-primary/50">
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="APA">APA (Social Sciences)</SelectItem>
                    <SelectItem value="MLA">MLA (Humanities)</SelectItem>
                    <SelectItem value="Chicago">Chicago (History/Arts)</SelectItem>
                    <SelectItem value="IEEE">IEEE (Engineering/Tech)</SelectItem>
                    <SelectItem value="Harvard">Harvard (Business/Science)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="citations" className="text-sm font-semibold">Min. Citations</Label>
                  <Input 
                    id="citations"
                    type="number"
                    min={1}
                    max={20}
                    value={citationCount}
                    onChange={(e) => setCitationCount(parseInt(e.target.value) || 5)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth" className="text-sm font-semibold">Research Depth</Label>
                  <Select 
                    value={researchDepth} 
                    onValueChange={(value: "brief" | "standard" | "comprehensive" | null) => {
                      if (value) setResearchDepth(value);
                    }}
                  >
                    <SelectTrigger id="depth" className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Advanced parameters allow you to tailor the agent&apos;s analytical rigor.
              </p>
            </div>
            <Button size="lg" onClick={handleCreate} className="w-full text-lg font-semibold py-6 rounded-xl">
              Launch Agents
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <DialogContent className="glass shadow-2xl border-white/10 sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-500">Delete Project</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Are you sure you want to delete this project? This action cannot be undone and will permanently remove all associated tasks, reports, and data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-end space-x-3 mt-6">
              <Button variant="ghost" onClick={() => setProjectToDelete(null)} className="hover:bg-white/5">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">Delete Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!projects ? (
          Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-56 glass animate-pulse" />)
        ) : projects.length === 0 ? (
          <div className="col-span-full py-24 text-center glass rounded-[2rem] border-white/5 space-y-6">
             <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
               <Search className="w-10 h-10 text-primary/40" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-semibold text-white">No Projects Recorded</h3>
               <p className="text-muted-foreground max-w-sm mx-auto">Your autonomous research journey begins here. Launch your first project to see the agents in action.</p>
             </div>
             <Button size="lg" variant="outline" onClick={() => setIsOpen(true)} className="rounded-xl px-8 border-white/20 text-white hover:bg-white/10 transition-all shadow-lg hover:shadow-white/5">
               Start First Research
             </Button>
          </div>
        ) : (
          projects.map((project: { _id: Id<"projects">; _creationTime: number; title: string; objective: string; status: string }) => (
            <Link key={project._id} href={`/dashboard/project/${project._id}`} className="block">
              <Card className="glass h-full group hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-primary/5 rounded-[1.5rem] overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className={`capitalize px-3 py-0.5 border-primary/20 bg-primary/5 text-primary`}>
                      {project.status === 'idle' ? 'Ready' : project.status}
                    </Badge>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      {new Date(project._creationTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1 flex-1">{project.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 -mt-1 -mr-2 z-10 shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setProjectToDelete(project._id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed mt-2">{project.objective}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center px-6 pb-6">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-sm border-2 border-background glass text-[8px] flex items-center justify-center font-bold">AI</div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-primary/70 group-hover:text-primary transition-colors">
                    Workspace <ArrowRight className="w-3 h-3" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}


