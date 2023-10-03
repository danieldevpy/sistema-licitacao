// __app.tsx
import '../app/globals.css';
import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '../application/assets/themes/themeContext'; // Certifique-se de que o caminho está correto
import lightTheme from '@/application/assets/themes/lightTheme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
