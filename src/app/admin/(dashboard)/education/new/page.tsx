import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { EducationForm } from "../EducationForm";
import { createEducationAction } from "../actions";

export default function NewEducationPage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/education")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Education
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add an entry</h1>
      <EducationForm action={createEducationAction} />
    </div>
  );
}
