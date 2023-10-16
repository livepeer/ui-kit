import { ThemeConfig } from '@livepeer/core-web/media';
import * as React from 'react';

export const ThemeContext = React.createContext<ThemeConfig | null>(null);
