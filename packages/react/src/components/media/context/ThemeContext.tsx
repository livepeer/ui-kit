import { ThemeConfig } from 'livepeer';

import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
