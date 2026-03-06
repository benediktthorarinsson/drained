import type { Metadata } from 'next'
import './globals.css'

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
      <body className="min-h-screen bg-cream-100">{children}</body>
    </html>
  )
}
