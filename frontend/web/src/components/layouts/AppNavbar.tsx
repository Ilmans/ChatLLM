import { Anchor, NavLink, Navbar } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { BsChat, BsHouse, BsHouseDoor, BsImage } from "react-icons/bs";


const data = [
    {icon: BsHouseDoor, label: 'Dashboard', link: '/'},
    {icon: BsChat, label: 'Chatbot AI', link: '/chat'},
    {icon: BsImage, label: 'Image Generative AI', link: '/home'},
]

export default function AppNavbar() {
    const [opened, setOpened] = useState(false);
    const [activeMenu, setActiveMenu] = useState(0)
    
    const items = data.map((item, index) => (
        <Link href={item.link} key={item.label}>
            <NavLink
                active={index == activeMenu}
                key={item.label}
                label={item.label}
                onClick={() => setActiveMenu(index)}
                icon={<item.icon />}            
            />
        </Link>
    ))

    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}> 
            {items}
        </Navbar>
    )
}