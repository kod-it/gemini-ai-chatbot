"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force client-side only rendering to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
