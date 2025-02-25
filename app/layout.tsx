import type { Metadata } from 'next'
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeProvider'


const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-spaceGrotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'CodeSphere',
  description: 'A Community-driven platform for asking and answering programming questions',
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 'primary-gradient',
              footerActionLink: 'primary-text-gradient hover:text-primary-500',
            }
          }}
        >
          <ThemeProvider>
            {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header> */}
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}