"use client"
import theme from "@/app/theme"
import { MantineProvider } from "@mantine/core"

export default function LayoutHome({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="layout">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={theme}
      >
        {children}
      </MantineProvider>
    </div>
  )
}