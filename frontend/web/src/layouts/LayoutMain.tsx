"use client"
import { ReactNode, useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  NavLink,
  MantineProvider,
} from '@mantine/core';
import { BsHouse, BsHouseDoor } from 'react-icons/bs'
import { NavigationProgress, nprogress } from '@mantine/nprogress';
import AppNavbar from '@/components/layouts/AppNavbar';
import AppHeader from '@/components/layouts/AppHeader';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { RouterTransition } from '@/components/RouterTransition';

interface Props {
  children: ReactNode
}

export default function LayoutMain({children}: Props) {
  const theme = useMantineTheme();
  const navbarActive = useState(false)
  return (

    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={theme}
    >

      <ProgressBar
        height="2px"
        color="#228be6"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        header={<AppHeader navbarActive={navbarActive}/>}
        navbar={<AppNavbar navbarActive={navbarActive}/>}
        layout='alt'
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
}