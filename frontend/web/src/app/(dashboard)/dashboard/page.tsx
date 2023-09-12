"use client"

import ChatUI from "@/components/ChatUI";
import Page from "@/components/layouts/Page";
import { Card, LoadingOverlay, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useChatContext } from "../../../../hooks/useChat";
import LoadingOverlayText from "@/components/LoadingOverlayText";

export default function Dashboard() {
    const chat = useChatContext()
    const [chatLoaded, setChatLoaded] = useState(false)
    useEffect(() => {
        chat.loadChat()
            .then(() => {
                setChatLoaded(true)
            })
    }, [])
    return (
        <div className="page">
            <Page
                title="Dashboard"
                subtitle="Usage statistics"
            >
                <Card withBorder radius="sm">
                    <Card.Section withBorder inheritPadding py={"xs"}>
                        <Title order={4} weight={600}>Chat</Title>
                    </Card.Section>
                    <Card.Section inheritPadding py={"xs"} pos={"relative"}>
                        <LoadingOverlay 
                            visible={!chatLoaded} 
                            loader={
                                <LoadingOverlayText text="Loading.." visible={!chatLoaded}/>
                            }
                        />
                        <ChatUI></ChatUI>
                    </Card.Section>
                </Card>
            </Page>
        </div>
    )
}
