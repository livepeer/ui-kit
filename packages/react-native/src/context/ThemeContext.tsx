import * as React from 'react';

import { ThemeConfig } from '../components/styling/stitches';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
