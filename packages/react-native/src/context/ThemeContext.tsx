import { ThemeConfig } from '@livepeer/core-react';
import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
