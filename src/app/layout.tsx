import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next/types";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "matheus",
  icons: {
    icon: "/static/icons8-lambda-96.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
