import { ThemeConfig } from 'livepeer/media';
import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
