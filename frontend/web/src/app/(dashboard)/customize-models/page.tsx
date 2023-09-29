"use client"

import Page from "@/components/layouts/Page";
import { Button, Card, Grid, Group, Input, Select, Text, Textarea, Title, Tooltip } from "@mantine/core";
import { useState } from "react";
import { useChatContext } from "../../../../hooks/useChat";
import { BsQuestionCircle } from "react-icons/bs";

export default function CustomizeModels() {
    const [model, setModel] = useState('')
    const chat = useChatContext()
    const [prompt, setPrompt] = useState("### User: You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\
If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.\n\
### Assistant:")

    return (
        <div className="page">
            <Page
                title="Customize Models"
                subtitle="Model customization"
            >
                <Card withBorder radius="sm" >
                    <Card.Section withBorder inheritPadding py={"xs"}>
                        <Group position="apart">
                            <Text>Choose model</Text>
                            <Group>
                                <Select zIndex={402} 
                                    value={model}
                                    onChange={(v) => setModel(v!)}
                                    placeholder="Choose model"
                                    data={chat.availableModels.map(m => m.local_id)}
                                />
                            </Group>
                        </Group>
                    </Card.Section>
                    <Card.Section inheritPadding py={"xs"} pos={"relative"}>
                        <Grid>
                            <Grid.Col span={4}>Prompt
                                <Tooltip label="test" position="right">
                                    <span>
                                    <BsQuestionCircle size={15} />
                                    </span>
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Textarea
                                    minRows={8}
                                    value={prompt}
                                    onChange={(v) => setPrompt(v.currentTarget.value)}
                                    placeholder="Choose model"
                                />
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={4}>Top P
                                <Tooltip label="The cumulative probability cutoff for token selection. Lower values mean sampling from a smaller, more top-weighted nucleus." position="right">
                                    <span>
                                    <BsQuestionCircle size={15} w={30}/>
                                    </span>
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Input placeholder={'0.8'}></Input>
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={4}>Top K
                                <Tooltip label="Controls randomness, higher values increase diversity." position="right">
                                    <span>
                                    <BsQuestionCircle size={15} w={30}/>
                                    </span>
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Input placeholder={'0.8'}></Input>
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={4}>Temperature
                                <Tooltip label="Temperature controls randomness, so a low temperature is less random (deterministic), while a high temperature is more random." position="right">
                                    <span>
                                    <BsQuestionCircle size={15} w={30}/>
                                    </span>
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Input placeholder={'0.8'}></Input>
                            </Grid.Col>
                        </Grid>
                        <Grid>
                            <Grid.Col span={4}>Max Tokens
                                <Tooltip label="test" position="right">
                                    <span>
                                    <BsQuestionCircle size={15} w={30}/>
                                    </span>
                                </Tooltip>
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Input placeholder={'0.8'}></Input>
                            </Grid.Col>
                        </Grid>
                    </Card.Section>
                </Card>
            </Page>
        </div>
    )
}