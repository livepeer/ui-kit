import {
  name as coreName,
  version as coreVersion,
} from './packages/core/package.json';
import {
  name as reactNativeName,
  version as reactNativeVersion,
} from './packages/react-native/package.json';
import {
  name as reactName,
  version as reactVersion,
} from './packages/react/package.json';
import fs from 'fs';

fs.writeFileSync(
  `./packages/core/src/providers/version.ts`,
  `export const core = \`${coreName}@${coreVersion}\`;
export const react = \`${reactName}@${reactVersion}\`;
export const reactNative = \`${reactNativeName}@${reactNativeVersion}\`;
`,
);
