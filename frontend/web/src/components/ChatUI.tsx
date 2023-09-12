import { Button, Divider, Group, ScrollArea, Table, Textarea } from "@mantine/core"
import { useState } from "react"
import { useForm } from '@mantine/form'

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

    const roleName = {
        [Role.BOT]: 'Bot',
        [Role.USER]: 'User',
    }

    const addMessage = (role: Role, message: string) => {
        const newMessage = {
            message, role
        }
        setChatMessages([...chatMessages, newMessage])
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
                        {chatMessages.map((msg) => (
                            <tr className="align-top py-3">
                                <td className="w-1/6 py-3">{roleName[msg.role]}:</td>
                                <td className="w-4/5 py-3">{msg.message}</td>
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