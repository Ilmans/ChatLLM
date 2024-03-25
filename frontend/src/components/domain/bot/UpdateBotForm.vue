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
import { onMounted, reactive, ref } from 'vue'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import { getFileContent } from '@/composables/useDocument'
import { CheckIcon, X } from 'lucide-vue-next'
import { File } from 'lucide-vue-next'
import { useModel } from '@/composables/useModel'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

const emit = defineEmits(['success'])
const db = useDb()
const activeBot = reactive<Bot>({
    name: '',
    description: '',
    prompt: '',
    id: 0,
    document: {
        filename: '',
        text: ''
    },
    params: {
        top_p: 0.2,
        temperature: 0.2,
        repetition_penalty: 0.2 
    }
})
const modelPopoverOpen = ref(false)
const chosenModel = ref<string>('RedPajama-INCITE-Chat-3B-v1-q4f32_1')

const inputPdf = ref()
const formSchema = toTypedSchema(z.object({
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
    top_p: z.array(z.number().min(0).max(1)).nullable(),
    temperature: z.array(z.number().min(0).max(1)).nullable(),
    repetition_penalty: z.array(z.number().min(0).max(1)).nullable(),
}))

const { handleSubmit, values, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
        repetition_penalty: [0.5],
        top_p: [0.7],
        temperature: [0.4],
    }
})

onMounted(async () => {
    Object.assign(activeBot, await db.getActiveBot())
    chosenModel.value = activeBot.botId
    setValues({
        name: activeBot.name,
        prompt: activeBot.prompt,
        description: activeBot.description,
    })
})



const onFileChange = async (e: InputEvent) => {
    const files = (e.target as HTMLInputElement).files
    activeBot.document = {
        filename: files[0].name,
        text: await getFileContent(files[0])
    }
}

const onSubmit = handleSubmit(async (v) => {
    const botCount = (await db.getBots()).length
    const {toast} = useToast()
    activeBot.botId = chosenModel.value
    activeBot.description = v.description
    activeBot.name = v.name
    activeBot.params.repetition_penalty = v.repetition_penalty
    activeBot.params.temperature = v.temperature
    activeBot.params.top_p = v.top_p
    activeBot.prompt = v.prompt
    toast({
        title: "Bot updated successfully"
    })
    db.updateBot(JSON.parse(JSON.stringify(activeBot)))
    emit("success", v)
})

const models = useModel().model_list
</script>
<template>
   <form class="space-y-6" @submit.prevent="onSubmit" method="POST" novalidate>
        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="EnglishHelperBot"  v-bind="componentField"/>
                    </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="EnglishHelperBot" v-bind="componentField"/>
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

        <FormField v-slot="{ componentField }" name="Model">
            <FormItem>  
                <FormLabel>Model</FormLabel>
                <Popover v-model:open="modelPopoverOpen">
                    <PopoverTrigger as-child>
                    <Button
                        variant="outline"
                        role="combobox"
                        :aria-expanded="modelPopoverOpen"
                        class="w-full justify-between"
                    >
                        {{ chosenModel
                        ? models.find((model) => model.local_id === chosenModel)?.local_id
                        : "Select model..." }}
                        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-[300px] p-0">
                    <Command>
                        <CommandInput class="h-9" placeholder="Search model..." />
                        <CommandEmpty>No model found</CommandEmpty>
                        <CommandList>
                        <CommandGroup>
                            <CommandItem
                            v-for="model in models"
                            :key="model.local_id"
                            :value="model.local_id"
                            @select="(ev) => {
                                if (typeof ev.detail.value === 'string') {
                                    chosenModel = ev.detail.value
                                }
                                modelPopoverOpen = false
                            }"
                            >
                            {{ model.local_id }}
                            <CheckIcon
                                :class="cn(
                                'ml-auto h-4 w-4',
                                chosenModel === model.local_id ? 'opacity-100' : 'opacity-0',
                                )"
                            />
                            </CommandItem>
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
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
            <div v-if="activeBot.document.filename !== ''" class="rounded-md border border-gray-400 p-3 flex justify-between items-center">
                <div class="filename flex gap-3">
                    <File />
                    {{ activeBot.document.filename }}
                </div>
                <button type="button" class="hover:text-white" @click="db.removeBotDocument()">
                    <X />
                </button>
            </div>
            <Input v-else type="file" placeholder="EnglishHelperBot" :ref="inputPdf" @change="onFileChange" accept="application/pdf"/>

        </FormItem>
        <div class="flex justify-end">
        <Button type="submit">
            Update
        </Button>
        </div>
    </form>
</template>