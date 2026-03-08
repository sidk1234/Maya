import type { Metadata } from "next";
import "@fontsource/manrope";
import "@fontsource/fraunces";

import "./globals.css";

export const metadata: Metadata = {
  title: "maya",
  description: "Interactive landing page and iPhone app prototype for maya, an AI conversation coach."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <script async src="https://mcp.figma.com/mcp/html-to-design/capture.js" />
        {children}
      </body>
    </html>
  );
}
