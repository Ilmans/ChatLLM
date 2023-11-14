"use client"
import { Box, Button, Center, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function Home() {
    return (
        <Box>
            <Center sx={{
                height: '100vh'
            }}>
                <Box className="text-center" >
                    <img src='https://rustacean.net/assets/rustacean-orig-noshadow.png' width={150}  className="text-center"></img>
                    <Title order={1} my={20}>Rust + Next + LLM</Title>
                    <Link href="/dashboard">
                        <Button variant="outline">Open Dashboard</Button>
                    </Link>
                </Box>
            </Center>
        </Box>
    )
}