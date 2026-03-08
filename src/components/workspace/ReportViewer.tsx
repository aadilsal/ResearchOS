import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Textarea } from "@/components/ui/textarea";

interface ReportViewerProps {
  content?: string;
  status: string;
  isEditing?: boolean;
  onContentChange?: (content: string) => void;
}

export function ReportViewer({ content, status, isEditing, onContentChange }: ReportViewerProps) {
  if (!content && !isEditing) {
    if (status === 'failed') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20 grayscale">
          <div className="w-16 h-16 rounded-full bg-destructive/5 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-destructive/10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium tracking-tight text-destructive/80">Research Incomplete</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              The research process was interrupted. No definitive report could be generated at this time.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-full bg-primary/10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium tracking-tight">Generating Report...</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Our AI agents are synthesizing the final research paper. This usually takes 30-60 seconds.
          </p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="h-full min-h-[500px] flex flex-col space-y-4">
        <Textarea
          value={content || ""}
          onChange={(e) => onContentChange?.(e.target.value)}
          className="flex-1 min-h-[600px] bg-white/5 border-white/10 text-white font-mono text-base leading-relaxed p-6 focus:border-primary/50 resize-none custom-scrollbar"
          placeholder="Edit your research report here (Markdown supported)..."
        />
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest text-right">
          Markdown Editor Active
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none 
      print:text-black print:prose-headings:text-black print:prose-p:text-[#333] print:prose-a:text-black print:prose-strong:text-black print:prose-li:text-[#333] print:bg-white
      prose-headings:tracking-tight prose-headings:font-bold
      prose-h1:text-4xl prose-h1:mb-10 prose-h1:text-primary
      prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/10 print:prose-h2:border-black/10
      prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
      prose-ul:my-6 prose-ol:my-6
      prose-li:text-muted-foreground prose-li:text-lg prose-li:mb-2
      prose-strong:text-white prose-strong:font-semibold
      prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 print:prose-blockquote:bg-black/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8
    " id="report-content">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content || ""}</ReactMarkdown>
    </div>
  );
}
