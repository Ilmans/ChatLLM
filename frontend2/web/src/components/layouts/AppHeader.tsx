import { Burger, Flex, Header, MediaQuery, Text, useMantineTheme } from "@mantine/core"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  navbarActive: [boolean, Dispatch<SetStateAction<boolean>>]
}

export default function AppHeader(props: Props) {
    const currentRoute = usePathname()
    const theme = useMantineTheme();
  
    return (
        <Header height={{ base: 50, md: 60 }} p="sm">
          <Flex align={'center'} h={'100%'}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={props.navbarActive[0]}
                onClick={() => props.navbarActive[1]((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

          </Flex>
        </Header>
    )
}