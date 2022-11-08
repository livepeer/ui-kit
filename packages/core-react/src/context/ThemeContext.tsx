import { ThemeConfig } from 'livepeer/styling';

import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
