"use client"
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
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        {children}
      </MantineProvider>
    </div>
  )
}