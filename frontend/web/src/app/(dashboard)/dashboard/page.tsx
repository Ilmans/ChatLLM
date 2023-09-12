"use client"

import ChatUI from "@/components/ChatUI";
import Page from "@/components/layouts/Page";
import { Card, Group, LoadingOverlay, Select, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useChatContext } from "../../../../hooks/useChat";
import LoadingOverlayText from "@/components/LoadingOverlayText";
import { InitProgressCallback, InitProgressReport } from "@mlc-ai/web-llm";

export default function Dashboard() {
    const chat = useChatContext()
    const [chatLoaded, setChatLoaded] = useState(false)
    const [loadingText, setLoadingText] = useState('')

    useEffect(() => {
        const modelLoadingCallback = (report: InitProgressReport) => {
            console.log('model loading..')
            setLoadingText(`Loading model.. (${Math.floor(report.progress * 100)}%)`)
        }

        chat.loadChat('Nous-Hermes-Llama2-13b', modelLoadingCallback)
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
                        <Group position="apart">
                            <Title order={4} weight={600}>Chat</Title>
                            <Select defaultValue={'Nous-Hermes-Llama2-13b'} data={chat.availableModels.map(m => ({
                                value: m.local_id,
                                label: m.local_id
                            }))}></Select>
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
