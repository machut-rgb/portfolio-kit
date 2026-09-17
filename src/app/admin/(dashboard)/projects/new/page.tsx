import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { ProjectForm } from "../ProjectForm";
import { createProjectAction } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/projects")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Projects
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add a project</h1>
      <ProjectForm action={createProjectAction} slugEditable />
    </div>
  );
}
