import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

import { PrimeReactProvider } from 'primereact/api'

import "primereact/resources/themes/lara-light-blue/theme.css"// import '@/theme/mytheme/theme.scss'

import 'primeicons/primeicons.css'
import { Suspense } from "react"

const geistSans = localFont({
  src: "./../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Targas - Distribuidor",
  description: "Sistema do Disitribuidor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const style = document.createElement('style')
              style.innerHTML = '@layer tailwind-base, primereact, tailwind-utilities;'
              style.setAttribute('type', 'text/css')
              document.querySelector('head').prepend(style)
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>

          <PrimeReactProvider>
            {children}
          </PrimeReactProvider>

        </Suspense>

      </body>
    </html>
  );
}
