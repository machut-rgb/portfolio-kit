import { presets } from "../src/lib/theme/presets";

console.log("Available theme presets:\n");
for (const preset of presets) {
  console.log(`  ${preset.id.padEnd(12)} ${preset.name} — ${preset.description}`);
}
console.log(`\n${presets.length} presets. Set one as default in config/theme.config.ts, or add your own in src/lib/theme/presets/.`);
