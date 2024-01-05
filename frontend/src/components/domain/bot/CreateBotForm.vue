<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormDescription, FormMessage, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { useDb } from "@/composables/useDb"
import { onMounted, ref } from 'vue'
import { getFileContent } from '@/composables/useDocument'

const emit = defineEmits(['success'])
const db = useDb()
const file = ref()

onMounted(() => {
    console.log('test', )
})

const formSchema = toTypedSchema(z.object({
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
    top_p: z.array(z.number().min(0).max(1)).nullable(),
    temperature: z.array(z.number().min(0).max(1)).nullable(),
    repetition_penalty: z.array(z.number().min(0).max(1)).nullable(),
}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        repetition_penalty: [0.5],
        top_p: [0.7],
        temperature: [0.4],
    }
})

const onFileChange = async (e: InputEvent) => {
    const files = (e.target as HTMLInputElement).files
    const read = await getFileContent(files[0])
    return read
}

const onSubmit = handleSubmit(async (v) => {
    const botCount = (await db.getBots()).length
    const {toast} = useToast()

    let document = {
        filename: '',
        text: ''
    }
    const inputFiles = (file.value.inputElement as HTMLInputElement).files
    if(inputFiles.length > 0) {
        // read file if exists
        document = {
            filename: inputFiles[0].name,
            text: await getFileContent(inputFiles[0])
        }

        console.log(document)
    }
    await db.insertBot({
        id: botCount+1,
        name: v.name,
        description: v.description,
        prompt: v.prompt,
        document,
        params: {
            top_p: v.top_p,
            temperature: v.temperature,
            repetition_penalty: v.repetition_penalty,
        }
    })
    toast({
        title: "Bot created successfully"
    })
    emit("success", v)
})
</script>
<template>
   <form class="space-y-6" @submit.prevent="onSubmit" method="POST" novalidate>
        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="EnglishHelperBot" v-bind="componentField" />
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="A bot that helps me learn english" v-bind="componentField" />
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="prompt">
            <FormItem>
                <FormLabel>Prompt</FormLabel>
                    <FormControl>
                        <Textarea  v-bind="componentField"></Textarea>
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <Text type="h4">
            Parameters
        </Text>
        <FormField v-slot="{ componentField }" name="top_p">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        Top P
                        <Text type="small">{{ values.top_p?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="temperature">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        Temperature
                        <Text type="small">{{ values.temperature?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="repetition_penalty">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        Repetition Penalty
                        <Text type="small">{{ values.repetition_penalty?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormItem>
            <Text type="small">Feed bot </Text>
            <Input type="file" placeholder="EnglishHelperBot" ref="file" @change="onFileChange" accept="application/pdf, text/plain"/>
        </FormItem>
        <div class="flex justify-end">
        <Button type="submit">
            Create
        </Button>
        </div>
    </form>
</template>