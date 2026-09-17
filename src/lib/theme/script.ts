import { THEME_STORAGE_KEY } from "./storage";

/**
 * Runs synchronously in <head> before first paint: restores the visitor's
 * saved theme (or a `?theme=` preview) so there is never a flash of the
 * default look. Kept dependency-free and tiny on purpose.
 */
export function themeInitScript(defaultPresetId: string, defaultMode: string): string {
  return `(function(){try{
var el=document.documentElement;
var raw=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var s=raw?JSON.parse(raw):{};
var q=new URLSearchParams(location.search);
var preset=q.get('theme')||s.presetId||${JSON.stringify(defaultPresetId)};
var mode=q.get('mode')||s.mode||${JSON.stringify(defaultMode)};
el.setAttribute('data-theme',preset);
var resolved=mode==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
el.setAttribute('data-mode',resolved);
el.setAttribute('data-mode-pref',mode);
if(!q.get('theme')&&s.vars){for(var k in s.vars){el.style.setProperty(k,s.vars[k]);}}
}catch(e){}})();`;
}
