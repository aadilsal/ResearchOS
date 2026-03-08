"use client";

import React, { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentTimeline, AgentStep } from "@/components/workspace/AgentTimeline";
import { ReportViewer } from "@/components/workspace/ReportViewer";
import { Play, Loader2, AlertCircle, Clock, Zap, FileText, RotateCcw, Pencil, Save, Download, X } from "lucide-react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";

export default function ProjectPage() {
  const { user } = useUser();
  const tokenIdentifier = user?.id ?? "";
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  
  const project = useQuery(api.projects.get, { 
    projectId, 
    tokenIdentifier 
  });
  
  const startResearch = useAction(api.orchestrator.startResearch);
  const updateReport = useMutation(api.reports.update);
  const [isStarting, setIsStarting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edited content when report loads
  React.useEffect(() => {
    if (project?.reports?.[0]?.content && editedContent === null) {
      setEditedContent(project.reports[0].content);
    }
  }, [project?.reports, editedContent]);

  if (project === undefined) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <p className="text-muted-foreground">The requested research project does not exist.</p>
      </div>
    );
  }

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const promise = startResearch({ 
        projectId, 
        objective: project.objective,
        tokenIdentifier,
      });

      toast.promise(promise, {
        loading: 'Agents are preparing the research plan...',
        success: 'Research initialized! Monitor the timeline for progress.',
        error: 'Terminal error: Failed to launch agents.',
      });

      await promise;
    } catch (error) {
      console.error("Failed to start research:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSaveReport = async () => {
    if (!project?.reports?.[0]?._id || editedContent === null) return;
    setIsSaving(true);
    try {
      await updateReport({
        reportId: project.reports[0]._id,
        content: editedContent,
      });
      toast.success("Report changes saved successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save report:", error);
      toast.error("Failed to save report edits.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const content = document.getElementById('report-content');
    if (!content) return;

    // Trigger browser print which we'll optimize with CSS
    window.print();
  };

  // Map project status to agent steps
  const agentSteps: AgentStep[] = [
    {
      type: "planner",
      label: "Autonomous Planner",
      description: "Breaking down the objective into actionable research tasks.",
      status: project.status === "planning" ? "running" : 
              project.status === "failed" && !project.tasks.length ? "failed" :
              ["researching", "reading", "analyzing", "completed"].includes(project.status) ? "completed" : "pending"
    },
    {
      type: "searcher",
      label: "Web Navigator",
      description: "Executing search tasks and gathering multi-source documentation.",
      status: project.status === "researching" ? "running" : 
              (project.status === "failed" && project.tasks.length > 0 && project.tasks.some(t => t.status !== 'completed')) ? "failed" :
              ["reading", "analyzing", "completed"].includes(project.status) ? "completed" : "pending"
    },
    {
      type: "reader",
      label: "Document Specialist",
      description: "Extracting key facts, data points, and insights from search results.",
      status: project.status === "reading" ? "running" : 
              ["analyzing", "completed"].includes(project.status) ? "completed" : "pending"
    },
    {
      type: "analyzer",
      label: "Strategic Strategist",
      description: "Synthesizing all insights into a professional research report.",
      status: project.status === "analyzing" ? "running" : 
              project.status === "completed" ? "completed" : "pending"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 print:hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {project.title}
            </h1>
            <Badge variant="outline" className={`capitalize px-3 py-1 ${
              project.status === 'failed' ? 'border-destructive/50 bg-destructive/10 text-destructive' : 'border-primary/20 bg-primary/5 text-primary'
            }`}>
              {project.status === 'idle' ? 'Ready' : project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            {project.objective}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl px-6 text-white border-white/20 hover:bg-white/5">
              Back to Dashboard
            </Button>
          </Link>

          {(project.status === 'idle' || project.status === 'failed') && (
            <Button 
              size="lg" 
              onClick={handleStart} 
              disabled={isStarting}
              className="rounded-xl px-8 py-6 text-lg font-semibold text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-all"
            >
              {isStarting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : project.status === 'failed' ? (
                <RotateCcw className="mr-2 h-5 w-5" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              {project.status === 'failed' ? 'Try Again' : 'Initiate Research'}
            </Button>
          )}
        </div>
      </div>

      {project.status === 'failed' && (
        <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-destructive">Research Job Interrupted</h3>
              <p className="text-sm text-destructive/80 leading-relaxed">
                {project.error || "The research agents encountered a critical error and could not complete the report. Please check your configuration or try again later."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Process & Tasks */}
        <div className="lg:col-span-4 space-y-8 print:hidden">
          <Card className="glass border-white/5 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Live Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AgentTimeline steps={agentSteps} />
            </CardContent>
          </Card>

          <Card className="glass border-white/5 shadow-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Research Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {project.tasks.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground italic">
                      Tasks will be generated during planning phase.
                    </div>
                ) : (
                  project.tasks.map((task: { _id: string; status: string; input?: { query?: string }; type: string }) => (
                    <div key={task._id} className="p-4 flex items-start gap-3 hover:bg-white/5 transition-colors">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-500' : 
                        task.status === 'running' ? 'bg-primary animate-pulse' : 'bg-muted'
                      }`} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{task.input?.query || task.type}</p>
                        <p className="text-xs text-muted-foreground capitalize">{task.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Report Viewer */}
        <div className="lg:col-span-8 print:col-span-12">
          <Card className="glass border-white/5 shadow-2xl min-h-[600px] flex flex-col print:border-none print:shadow-none print:bg-transparent">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between print:hidden">
              <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Final Intelligence Report
              </CardTitle>
              <div className="flex items-center gap-2">
                {project.status === 'completed' && (
                  <>
                    {isEditing ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setIsEditing(false);
                            setEditedContent(project.reports[0].content);
                          }}
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-3 h-3 mr-1" /> Cancel
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleSaveReport}
                          disabled={isSaving}
                          className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/10"
                        >
                          {isSaving ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <Save className="w-3 h-3 mr-1" />
                          )}
                          Save Edits
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                          className="h-8 text-xs text-white hover:bg-white/5"
                        >
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleDownloadPDF}
                          className="h-8 text-xs text-white hover:bg-white/5"
                        >
                          <Download className="w-3 h-3 mr-1" /> PDF
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-[800px] custom-scrollbar print:max-h-none print:overflow-visible print:p-0">
              <ReportViewer 
                content={isEditing ? (editedContent ?? "") : (project.reports?.[0]?.content)} 
                status={project.status}
                isEditing={isEditing}
                onContentChange={setEditedContent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
