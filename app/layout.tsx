import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tekton Words',
  description: 'AI-powered copy generation for your business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-zinc-950">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
