import "@mantine/core/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        style={{
          height: "100vh",
          background:
            "linear-gradient(to bottom, var(--mantine-color-gray-9), var(--mantine-color-teal-8))",
        }}
      >
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
