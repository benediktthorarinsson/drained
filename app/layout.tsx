import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Drained — Weekly Capacity Planner',
  description: 'Plan your week by energy, not just time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-cream-100 ${inter.className}`}>{children}</body>
    </html>
  )
}
