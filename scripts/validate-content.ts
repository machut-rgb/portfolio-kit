import { siteContent } from "../content";
import { formatIssues, siteContentSchema } from "../src/lib/content/schema";

const result = siteContentSchema.safeParse(siteContent);

if (!result.success) {
  console.error("✗ Content is invalid:\n");
  console.error(formatIssues(result.error));
  process.exit(1);
}

console.log(`✓ Content is valid — ${result.data.projects.length} projects, ${result.data.experience.length} roles.`);
