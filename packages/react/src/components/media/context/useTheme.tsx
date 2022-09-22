import * as React from 'react';

import { ThemeContext } from './ThemeContext';

export const useTheme = () => {
  return React.useContext(ThemeContext);
};
