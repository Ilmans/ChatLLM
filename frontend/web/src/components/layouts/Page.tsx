import { Box, Flex, Text, Title } from "@mantine/core";
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    title: string 
    subtitle?: string 
    rightItem?: ReactNode
}

export default function Page({ title, subtitle, rightItem, children }: Props) {
    return (
        <>
            <Box className="dashboard__heading" mb={24}>
                <Flex justify={'space-between'}>
                    <div className="heading-left">
                        <Title order={2}>{title}</Title>
                        {subtitle && (
                            <Text c={'dimmed'}>{subtitle}</Text>
                        )}
                    </div>
                    <div className="heading-right">
                        {rightItem}
                    </div>
                </Flex>
            </Box>
            <div className="dashboard__content">
                {children}
            </div>
        </>
    )
}   