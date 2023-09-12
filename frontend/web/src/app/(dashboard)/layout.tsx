"use client"

import LayoutMain from '@/layouts/LayoutMain'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutMain>
      {children}
    </LayoutMain>
  )
}
