"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2, Search, Trash, Folder } from "lucide-react";
import { Card} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";

export default function ProjectsPage() {
  const { user } = useUser();
  const tokenIdentifier = user?.id ?? "";
  
  const userData = useQuery(api.users.me, { tokenIdentifier });
  const tenantId = userData?.tenants?.[0]?._id;

  const projects = useQuery(api.projects.listByTenant, 
    tenantId ? { tenantId, tokenIdentifier } : "skip"
  );

  const [projectToDelete, setProjectToDelete] = useState<Id<"projects"> | null>(null);

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

  if (userData === undefined || projects === undefined) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          All Projects
        </h2>
        <p className="text-muted-foreground mt-2">View and manage all your research projects in detail.</p>
      </div>

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

      {projects.length === 0 ? (
        <div className="py-24 text-center glass rounded-[2rem] border-white/5 space-y-6">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-primary/40" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">No Projects Found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">You haven&apos;t created any projects yet.</p>
          </div>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="mt-4 rounded-xl px-8 border-white/20 text-white hover:bg-white/10 transition-all shadow-lg hover:shadow-white/5">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <Card key={project._id} className="glass border-white/10 hover:border-primary/30 transition-all group overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/dashboard/project/${project._id}`} className="hover:underline">
                        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                      </Link>
                      <Badge variant="outline" className="px-2 py-0 border-primary/20 bg-primary/5 text-primary capitalize text-xs">
                        {project.status === 'idle' ? 'Ready' : project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl">
                      {project.objective}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2">
                      <span className="flex items-center gap-1.5"><strong className="text-white">Depth:</strong> <span className="capitalize">{project.researchDepth || 'Standard'}</span></span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1.5"><strong className="text-white">Style:</strong> <span className="uppercase">{project.citationStyle || 'APA'}</span></span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1.5"><strong className="text-white">Citations:</strong> {project.citationCount || 5}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{new Date(project._creationTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-16 md:ml-0">
                  <Link href={`/dashboard/project/${project._id}`}>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                      Open Workspace
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => setProjectToDelete(project._id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
