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
import type { Bot } from "@/types";
import { onMounted, ref } from 'vue'
import * as pdfJs from "pdfjs-dist";
import * as pdfJsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
console.log(pdfJs)

pdfJs.GlobalWorkerOptions.workerSrc = pdfJsWorker
const emit = defineEmits(['success'])
const db = useDb()
const activeBot = ref<Bot>()
const inputPdf = ref()
onMounted(async () => {
    activeBot.value = await db.getActiveBot()
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

const readPdfs = (files: FileList) => {
    
    return new Promise(res => {
        const reader = new FileReader()
        reader.onload = async e => {
            const arrayBuffer = reader.result
            const doc = await pdfJs.getDocument(arrayBuffer).promise

            const readPage = async (pageNumber: number) => {
                const page = await doc.getPage(pageNumber)

                const textContent = await page.getTextContent()
                
                const contentToString = () => {
                    const result = []
                    textContent.items.forEach(item => {
                        item = (item as TextItem)
                        if (item.height == 0 && item.width == 0) {
                            // Break line
                            result.push("\n")
                            return
                        } 
                        result.push(item.str)
                    })
                    return result.join('')
                }
                return contentToString()
            }

            const result = []
            for(let i = 1; i <= doc.numPages; i++) {
                const pageContent = await readPage(i)
                result.push(pageContent)
            }
            console.log(result.join('\n\n'))

            return res(result.join('\n\n'))
        }
        reader.readAsArrayBuffer(files[0])
    })
}
const onFileChange = async (e: InputEvent) => {
    const files = (e.target as HTMLInputElement).files
    readPdfs(files)
}
const onSubmit = handleSubmit(async (v) => {
    const botCount = (await db.getBots()).length
    const {toast} = useToast()
    toast({
        title: "Bot created successfully"
    })
    db.insertBot({
        id: botCount+1,
        name: v.name,
        description: v.description,
        prompt: v.prompt,
        params: {
            top_p: v.top_p,
            temperature: v.temperature,
            repetition_penalty: v.repetition_penalty,
        }
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
                        <Input type="text" placeholder="EnglishHelperBot" v-bind="componentField" :value="activeBot?.name"/>
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="EnglishHelperBot" v-bind="componentField" :value="activeBot?.name"/>
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="prompt">
            <FormItem>
                <FormLabel>Prompt</FormLabel>
                    <FormControl>
                        <Textarea  v-bind="componentField" :value="activeBot?.description"></Textarea>
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
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField" :value="activeBot?.params.top_p"></Slider>
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
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField" :value="activeBot?.params.temperature"></Slider>
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
                    <Slider :min="0" :max="1" :step="0.1"  v-bind="componentField" :value="activeBot?.params.repetition_penalty"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormItem>
            <Text type="small">Feed bot with PDF</Text>
            <Input type="file" placeholder="EnglishHelperBot" :ref="inputPdf" @change="onFileChange" accept="application/pdf"/>
        </FormItem>
        <div class="flex justify-end">
        <Button type="submit">
            Update
        </Button>
        </div>
    </form>
</template>