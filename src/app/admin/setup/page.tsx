import { redirect } from "next/navigation";
import { db } from "@/lib/db/client";
import { hasAdminAccount } from "@/lib/auth/setup";
import { getSession } from "@/lib/auth/session";
import { adminHref } from "@/lib/auth/config";
import { getThemeSettings } from "@/lib/settings";
import { presets } from "@/lib/theme/presets";
import { AccountStep, ProfileStep, ThemeStep } from "./SetupForms";

const STEPS = ["Account", "About you", "Look"] as const;

/**
 * First-run wizard. Step 1 is deliberately reachable without a session,
 * because there is nobody to authenticate yet; it is gated on there being
 * no account rather than on who is asking. Steps 2 and 3 require the
 * session that step 1 creates.
 */
export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step: rawStep } = await searchParams;
  const accountExists = await hasAdminAccount();
  const session = await getSession();

  // Nobody home yet: only step 1 makes sense.
  if (!accountExists) {
    return <Shell step={1}>{<AccountStep />}</Shell>;
  }

  // An account exists but this visitor is not signed in, so setup is over
  // as far as they are concerned.
  if (!session) {
    redirect(adminHref("/login"));
  }

  const step = rawStep === "3" ? 3 : 2;

  if (step === 3) {
    const theme = await getThemeSettings();
    return (
      <Shell step={3}>
        <ThemeStep
          presets={presets.map((p) => ({ id: p.id, name: p.name, description: p.description }))}
          current={{ preset: theme.defaultPreset, mode: String(theme.defaultMode) }}
        />
      </Shell>
    );
  }

  const existing = await db.query.profile.findFirst();
  return (
    <Shell step={2}>
      <ProfileStep
        defaults={{
          firstName: existing?.firstName ?? "",
          lastName: existing?.lastName ?? "",
          contactEmail: existing?.email ?? session.email,
        }}
      />
    </Shell>
  );
}

function Shell({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <div className="eyebrow mb-2">Setup</div>
          <h1 className="text-heading mb-4">{["Create your account", "Tell us about you", "Pick a look"][step - 1]}</h1>

          <ol className="flex gap-2" aria-label="Setup progress">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className="flex-1 text-2xs font-mono pt-2 border-t-2"
                style={{
                  borderColor: i + 1 <= step ? "var(--p-primary)" : "var(--p-border)",
                  color: i + 1 <= step ? "var(--p-fg)" : "var(--p-fg-subtle)",
                }}
              >
                {i + 1}. {label}
              </li>
            ))}
          </ol>
        </div>

        <div className="card">{children}</div>

        {step === 1 && (
          <p className="text-2xs mt-4 text-center" style={{ color: "var(--p-fg-subtle)" }}>
            This page is only available until the first account is created.
          </p>
        )}
      </div>
    </div>
  );
}
