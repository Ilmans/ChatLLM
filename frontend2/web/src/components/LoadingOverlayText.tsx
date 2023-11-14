import { LoadingOverlay, Loader, Box } from "@mantine/core";

export default function LoadingOverlayText({ visible, text }: {
    visible: boolean
    text: string
}) {

    const loader = (
        <Box ta={"center"}>
            <Box>
                <Loader />
            </Box>
            {text}
        </Box>
    )
    return (
        <LoadingOverlay visible={visible} loader={loader} radius={"sm"} overlayOpacity={.3}/>
    )
}