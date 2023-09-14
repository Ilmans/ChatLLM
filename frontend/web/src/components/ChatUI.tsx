import { Button, Divider, Group, Loader, ScrollArea, Table, Textarea } from "@mantine/core"
import { useState } from "react"
import { useForm } from '@mantine/form'
import { useChatContext } from "../../hooks/useChat"

enum Role {
    USER,
    BOT,
}

interface ChatMessage {
    role: Role
    message: string
}

export default function ChatUI() {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const chat = useChatContext()

    const roleName = {
        [Role.BOT]: 'Bot',
        [Role.USER]: 'User',
    }

    const addMessage = async (role: Role, message: string) => {
        const newMessage = {
            message, role
        }
        const newBotMessage = {
            message: "",
            role: Role.BOT
        }
        let newMessages = [...chatMessages, newMessage, newBotMessage]
        setChatMessages(newMessages)
        console.log(message)

        const messageFormatted = `### Instruction:
        ${message}
        
        ### Response:
        
        `

        const response = await chat.sendMessage(messageFormatted, (step, msg) => {
            console.log(step, msg, newMessages)
            newMessages[newMessages.length-1].message = msg
            setChatMessages([...newMessages])
        })
        setChatMessages([...newMessages])
        console.log('response:', response)

        console.log(await chat.runtimeStatsText());
    }

    
    const form = useForm({
        initialValues: {
            message: ''
        }
    })
    
    const submitMessage = () => {
        return form.onSubmit((values) => {
            addMessage(Role.USER, values.message)
        })
    }
    
    return (
        
        <div className="messages">
            <ScrollArea h={300}>
                <Table>
                    <thead>
                        {chatMessages.map((msg,i) => (
                            <tr className="align-top py-3" key={i}>
                                <td className="w-1/6 py-3">{roleName[msg.role]}:</td>
                                <td className="w-4/5 py-3">
                                    {(msg.role == Role.BOT && msg.message == "") ? (
                                        <Loader size="sm" variant="dots" />
                                    ) : msg.message }
                                </td>
                            </tr>
                        ))}
                    </thead>
                </Table>
            </ScrollArea>
            <Divider my={10}></Divider>
            <form onSubmit={submitMessage()}>
                <Textarea label="Your message:"  {...form.getInputProps("message")}></Textarea>
                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </div>
    )
}