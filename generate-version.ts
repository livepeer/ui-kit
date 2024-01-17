import fs from "fs";
import {
  name as coreName,
  version as coreVersion,
} from "./packages/core/package.json";
import {
  name as reactName,
  version as reactVersion,
} from "./packages/react/package.json";

fs.writeFileSync(
  "./packages/core/src/version.ts",
  `const core = '${coreName}@${coreVersion}';
const react = '${reactName}@${reactVersion}';

export const version = {
  core,
  react,
} as const;
`,
);
