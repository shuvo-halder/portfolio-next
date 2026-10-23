import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center font-mono space-y-6">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-accent-red/40 bg-accent-red/10 text-accent-red text-xs">
        <Terminal className="w-3.5 h-3.5" />
        <span>404: SPECIFICATION_NOT_FOUND</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground">
        Project Not Located in Repository
      </h1>

      <p className="text-xs text-muted leading-relaxed">
        The requested project architecture specification could not be located in the current
        telemetry registry. Please return to the primary projects overview.
      </p>

      <div className="pt-4">
        <Link
          href="/#projects"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-accent-emerald text-background font-bold text-xs hover:bg-accent-emerald/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN_TO_PROJECTS</span>
        </Link>
      </div>
    </div>
  );
}
