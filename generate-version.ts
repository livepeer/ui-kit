import {
  name as coreName,
  version as coreVersion,
} from './packages/core/package.json';
import {
  name as reactName,
  version as reactVersion,
} from './packages/react/package.json';
import {
  name as reactNativeName,
  version as reactNativeVersion,
} from './packages/react-native/package.json';
import fs from 'fs';

fs.writeFileSync(
  `./packages/core/src/version.ts`,
  `const core = \`${coreName}@${coreVersion}\`;
const react = \`${reactName}@${reactVersion}\`;
const reactNative = \`${reactNativeName}@${reactNativeVersion}\`;

export const version = {
  core,
  react,
  reactNative,
} as const;
`,
);
