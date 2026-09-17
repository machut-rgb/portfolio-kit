"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getPreset, presets } from "./presets";
import { allVars, applyOverrides } from "./tokens";
import { THEME_STORAGE_KEY, type PersistedTheme } from "./storage";
import type { ThemeMode, ThemeOverrides, ThemePreset } from "./types";

export type ModePreference = ThemeMode | "system";

interface ThemeContextValue {
  /** Active preset id. */
  presetId: string;
  /** What the visitor asked for (may be "system"). */
  mode: ModePreference;
  /** What is actually painted. */
  resolvedMode: ThemeMode;
  /** Preset + overrides, fully merged. */
  theme: ThemePreset;
  overrides: ThemeOverrides;
  presets: ThemePreset[];
  /** True once client state has taken over from the server-rendered default. */
  ready: boolean;
  setPreset: (id: string) => void;
  setMode: (mode: ModePreference) => void;
  /** `path` is dot-notation into a preset, e.g. `colors.dark.primary`. */
  setOverride: (path: string, value: unknown) => void;
  getValue: (path: string) => unknown;
  resetOverrides: () => void;
  /** TypeScript snippet to paste into `config/theme.config.ts`. */
  exportSnippet: () => string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function writePath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const out: Record<string, unknown> = { ...obj };
  let cursor = out;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    const next = cursor[key];
    cursor[key] = typeof next === "object" && next !== null ? { ...(next as object) } : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]!] = value;
  return out as T;
}

export function ThemeProvider({
  children,
  defaultPresetId,
  defaultMode,
  defaultOverrides,
}: {
  children: ReactNode;
  defaultPresetId: string;
  defaultMode: ModePreference;
  defaultOverrides?: ThemeOverrides;
}) {
  const [presetId, setPresetId] = useState(defaultPresetId);
  const [mode, setModeState] = useState<ModePreference>(defaultMode);
  const [systemMode, setSystemMode] = useState<ThemeMode>("dark");
  const [overrides, setOverrides] = useState<ThemeOverrides>(defaultOverrides ?? {});
  const [ready, setReady] = useState(false);
  const appliedKeys = useRef<string[]>([]);

  // Adopt whatever the pre-paint script decided, then follow the system.
  useEffect(() => {
    const el = document.documentElement;
    const storedPreset = el.getAttribute("data-theme");
    const storedMode = el.getAttribute("data-mode-pref") as ModePreference | null;
    if (storedPreset) setPresetId(storedPreset);
    if (storedMode) setModeState(storedMode);
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedTheme;
        if (parsed.overrides) setOverrides(parsed.overrides as ThemeOverrides);
      }
    } catch {
      /* corrupted storage is not worth crashing over */
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemMode(mq.matches ? "dark" : "light");
    sync();
    mq.addEventListener("change", sync);
    setReady(true);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const basePreset = useMemo(() => getPreset(presetId), [presetId]);
  const theme = useMemo(() => applyOverrides(basePreset, overrides), [basePreset, overrides]);
  const resolvedMode: ThemeMode = mode === "system" ? systemMode : mode;

  // Push state to the DOM: attributes select the preset stylesheet, inline
  // properties carry only what the visitor actually customised.
  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    el.setAttribute("data-theme", presetId);
    el.setAttribute("data-mode", resolvedMode);
    el.setAttribute("data-mode-pref", mode);

    const base = allVars(basePreset, resolvedMode);
    const next = allVars(theme, resolvedMode);
    const diff: Record<string, string> = {};
    for (const [key, value] of Object.entries(next)) {
      if (base[key] !== value) diff[key] = value;
    }
    for (const key of appliedKeys.current) {
      if (!(key in diff)) el.style.removeProperty(key);
    }
    for (const [key, value] of Object.entries(diff)) {
      el.style.setProperty(key, value);
    }
    appliedKeys.current = Object.keys(diff);

    const payload: PersistedTheme = {
      presetId,
      mode,
      overrides: overrides as Record<string, unknown>,
      vars: diff,
    };
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* private mode, quota — the theme still applies for this session */
    }
  }, [ready, presetId, mode, resolvedMode, theme, basePreset, overrides]);

  const setOverride = useCallback((path: string, value: unknown) => {
    setOverrides((prev) => writePath(prev as Record<string, unknown>, path, value) as ThemeOverrides);
  }, []);

  const getValue = useCallback((path: string) => readPath(theme, path), [theme]);

  const exportSnippet = useCallback(() => {
    const body = JSON.stringify(overrides, null, 2);
    return [
      `import type { ThemeConfig } from "@/lib/theme/types";`,
      ``,
      `export const themeConfig = {`,
      `  defaultPreset: ${JSON.stringify(presetId)},`,
      `  defaultMode: ${JSON.stringify(mode)},`,
      `  overrides: ${body.replace(/\n/g, "\n  ")},`,
      `};`,
    ].join("\n");
  }, [overrides, presetId, mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      presetId,
      mode,
      resolvedMode,
      theme,
      overrides,
      presets,
      ready,
      setPreset: setPresetId,
      setMode: setModeState,
      setOverride,
      getValue,
      resetOverrides: () => setOverrides({}),
      exportSnippet,
    }),
    [presetId, mode, resolvedMode, theme, overrides, ready, setOverride, getValue, exportSnippet],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
