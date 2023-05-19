import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import './globals.css'

import { ToasterContext } from './contexts/ToasterContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Messenger Clone',
  description: 'Messenger Clone',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext />
        {children}
      </body>
    </html>
  )
}
