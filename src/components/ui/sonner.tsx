"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";
import { useApp } from "../../contexts/AppContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { settings } = useApp();

  return (
    <Sonner
      theme={settings.theme === 'dark' ? 'dark' : 'light'}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
