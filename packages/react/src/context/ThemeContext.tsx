import { ThemeConfig } from 'livepeer/media/browser/styling';
import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
