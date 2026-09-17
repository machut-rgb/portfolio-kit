import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { ExperienceForm } from "../ExperienceForm";
import { createExperienceAction } from "../actions";

export default function NewExperiencePage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/experience")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Experience
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add a role</h1>
      <ExperienceForm action={createExperienceAction} />
    </div>
  );
}
