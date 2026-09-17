import Link from "next/link";
import { adminHref } from "@/lib/auth/config";
import { Icon } from "@/components/ui/Icon";
import { SkillGroupForm } from "../SkillGroupForm";
import { createSkillGroupAction } from "../actions";

export default function NewSkillGroupPage() {
  return (
    <div className="max-w-2xl">
      <Link href={adminHref("/skills")} className="link-quiet text-sm inline-flex items-center gap-1.5 mb-6">
        <Icon name="chevronRight" className="rotate-180" />
        Skills
      </Link>
      <div className="eyebrow mb-2">Content</div>
      <h1 className="text-heading mb-6">Add a skill group</h1>
      <SkillGroupForm action={createSkillGroupAction} />
    </div>
  );
}
