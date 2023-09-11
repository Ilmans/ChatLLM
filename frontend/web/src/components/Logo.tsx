import { Box, Title } from "@mantine/core";

export default function Logo() {
    return (
        <Title sx={(theme) => ({
            fontSize: theme.fontSizes.lg
        })}>RustLLM</Title>
    )
}