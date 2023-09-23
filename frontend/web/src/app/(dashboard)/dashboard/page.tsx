"use client"

import ChatUI from "@/components/ChatUI";
import Page from "@/components/layouts/Page";
import { Button, Card, Group, LoadingOverlay, Select, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useChatContext } from "../../../../hooks/useChat";
import LoadingOverlayText from "@/components/LoadingOverlayText";
import { InitProgressCallback, InitProgressReport } from "@mlc-ai/web-llm";

export default function Dashboard() {
    const chat = useChatContext()
    const [chatLoaded, setChatLoaded] = useState(false)
    const [loadingText, setLoadingText] = useState('')

    const [model, setModel] = useState('')
    const modelLoadingCallback = (report: InitProgressReport) => {
        console.log('model loading..')
        setLoadingText(`Loading model.. (${Math.floor(report.progress * 100)}%)`)
    }
    
    const load = () => {
        chat.loadChat(model, modelLoadingCallback)
            .then(() => {
                setChatLoaded(true)
            })
    }

    return (
        <div className="page">
            <Page
                title="Dashboard"
                subtitle="Usage statistics"
            >
                <Card withBorder radius="sm">
                    <Card.Section withBorder inheritPadding py={"xs"}>
                        <Group position="apart">
                            <Title order={4} weight={600}>Chat</Title>
                            <Group>
                                <Select zIndex={402} 
                                    value={model}
                                    onChange={(v) => setModel(v!)}
                                    placeholder="Choose model"
                                    data={chat.availableModels.map(m => m.local_id)}/>
                                <Button onClick={load}>Load</Button>
                            </Group>
                        </Group>
                    </Card.Section>
                    <Card.Section inheritPadding py={"xs"} pos={"relative"}>
                        <LoadingOverlay 
                            visible={!chatLoaded} 
                            loader={
                                <LoadingOverlayText text={loadingText} visible={!chatLoaded}/>
                            }
                        />
                        <ChatUI></ChatUI>
                    </Card.Section>
                </Card>
            </Page>
        </div>
    )
}
