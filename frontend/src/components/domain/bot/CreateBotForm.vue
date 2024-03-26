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
import { useModel } from '@/composables/useModel'
import { onMounted, ref } from 'vue'
import { getFileContent } from '@/composables/useDocument'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDown } from 'lucide-vue-next'

const emit = defineEmits(['success'])
const db = useDb()
const file = ref()

const formSchema = toTypedSchema(z.object({
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
    top_p: z.array(z.number().min(0).max(1)).nullable(),
    temperature: z.array(z.number().min(0).max(2)).nullable(),
    frequency_penalty: z.array(z.number().min(-2).max(2)).nullable(),
    max_gen_len: z.array(z.number().min(0).max(1000)).nullable(),
}))

const { handleSubmit, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        frequency_penalty: [0.5],
        max_gen_len: [300],
        top_p: [0.7],
        temperature: [0.4],
    }
})

const onFileChange = async (e: InputEvent) => {
    const files = (e.target as HTMLInputElement).files
    const read = await getFileContent(files[0])
    return read
}


const modelPopoverOpen = ref(false)
const chosenModel = ref<string>('RedPajama-INCITE-Chat-3B-v1-q4f32_1')

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

    }
    await db.insertBot({
        id: botCount+1,
        name: v.name,
        description: v.description,
        prompt: v.prompt,
        document,
        botId: chosenModel.value,
        params: {
            top_p: v.top_p,
            max_gen_len: v.max_gen_len,
            temperature: v.temperature,
            frequency_penalty: v.frequency_penalty,
        }
    })
    toast({
        title: "Bot created successfully"
    })
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
                        <CommandInput class="h-9" placeholder="Search framework..." />
                        <CommandEmpty>No framework found.</CommandEmpty>
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
                    <Slider :min="0" :max="2" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="temperature">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        Max Generation Length
                        <Text type="small">{{ values.max_gen_len?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="10" :max="1000" :step="10"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="frequency_penalty">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        Frequency Penalty
                        <Text type="small">{{ values.frequency_penalty?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="-2" :max="2" :step="0.1"  v-bind="componentField"></Slider>
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