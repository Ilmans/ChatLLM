import { Burger, Header, MediaQuery, Text, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react";

export default function AppHeader() {
    const currentRoute = usePathname()
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
  
    return (
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Link href={'/'}>RustLLM</Link>
          </div>
        </Header>
    )
}