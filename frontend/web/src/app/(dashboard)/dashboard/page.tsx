"use client"

import ChatUI from "@/components/ChatUI";
import Page from "@/components/layouts/Page";
import { Card, Text, Title } from "@mantine/core";

export default function Dashboard() {
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
                    <Card.Section inheritPadding py={"xs"}>
                        <ChatUI></ChatUI>
                    </Card.Section>
                </Card>
            </Page>
        </div>
    )
}
