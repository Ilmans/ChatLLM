"use client"

import LayoutMain from '@/layouts/LayoutMain'
import { ChatProvider } from '../../../hooks/useChat'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutMain>
      <ChatProvider>
      {children}
      </ChatProvider>
    </LayoutMain>
  )
}
