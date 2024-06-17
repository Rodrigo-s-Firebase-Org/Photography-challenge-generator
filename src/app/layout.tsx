import type { Metadata } from "next";
import AuthProvider from './context/Auth.context';
import "./globals.css";
import Wrapper from "./components/Layouts/Wrapper/Wrapper";

export const metadata: Metadata = {
  title: "Photo weekly challenge",
  description: "Photo weekly challenge",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" className="dark-theme">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Wrapper>
            {children}
          </Wrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
