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
import { NavigationProgress } from '@mantine/nprogress';
import AppNavbar from '@/components/layouts/AppNavbar';
import AppHeader from '@/components/layouts/AppHeader';

interface Props {
  children: ReactNode
}

export default function LayoutMain({children}: Props) {
  const theme = useMantineTheme();
  return (

    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <AppShell
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={<AppNavbar/>}
        header={<AppHeader/>}
      >
        <NavigationProgress/>
        {children}
      </AppShell>
    </MantineProvider>
  );
}