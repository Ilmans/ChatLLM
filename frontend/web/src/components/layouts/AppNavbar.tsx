import theme from "@/app/theme";
import { Anchor, Box, Image, NavLink, Navbar, Text, rem } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { BsChat, BsHouse, BsHouseDoor, BsImage } from "react-icons/bs";


const data = [
    {icon: BsHouseDoor, label: 'Dashboard', link: '/dashboard'},
    {icon: BsChat, label: 'Chatbot AI', link: '/chat'},
    {icon: BsImage, label: 'Image Generative AI', link: '/home'},
]

export default function AppNavbar() {
    const [opened, setOpened] = useState(false);
    const [activeMenu, setActiveMenu] = useState(0)
    
    const items = data.map((item, index) => (
        <Link href={item.link} key={item.label}>
            <NavLink
                px={20}
                py={10}
                mb={3}
                active={index == activeMenu}
                key={item.label}
                label={item.label}
                onClick={() => setActiveMenu(index)}
                className="rounded-md"
                icon={<item.icon />}            
            />
        </Link>
    ))

    return (
        <>
            <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }} withBorder={false}> 
                <Navbar.Section my={15} px={5}>
                    <Box p={16}>
                        <Image src={'/logo.png'} height={25} width={'auto'}></Image>
                    </Box>
                </Navbar.Section>
                <Navbar.Section px={16}>
                    {items}
                </Navbar.Section>
            </Navbar>
        </>
    )
}