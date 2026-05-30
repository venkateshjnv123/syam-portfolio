import type { Metadata } from 'next'
import { Bricolage_Grotesque, Onest, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Syam Kumar — Video Editor & Content Creator',
  description:
    'Video editor, content creator and graphic designer based in Visakhapatnam, India. Specializing in cinematic edits, motion graphics, color grading and social media content.',
  keywords: [
    'video editor', 'content creator', 'motion graphics', 'color grading',
    'Visakhapatnam', 'India', 'Premiere Pro', 'After Effects', 'CapCut',
  ],
  openGraph: {
    title: 'Syam Kumar — Video Editor & Content Creator',
    description: 'Cinematic stories and high-retention content for brands worldwide.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${onest.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
