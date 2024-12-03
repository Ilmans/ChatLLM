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
import { useLLM } from '@/composables/useLLM'
import QuestionMark from '@/components/ui/tooltip/QuestionMark.vue'

const emit = defineEmits(['success'])
const db = useDb()
const llm = useLLM()
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


const modelPopoverOpen = ref(false)
const chosenModel = ref<string>('RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k')

const onSubmit = handleSubmit(async (v) => {
    const botCount = (await db.getBots()).length
    const {toast} = useToast()

    // let document = {
    //     filename: '',
    //     text: ''
    // }
    // const inputFiles = (file.value.inputElement as HTMLInputElement).files
    // if(inputFiles.length > 0) {
    //     // read file if exists
    //     document = {
    //         filename: inputFiles[0].name,
    //         text: await getFileContent(inputFiles[0])
    //     }
    // }
    await llm.insertBot({
        id: botCount+1,
        name: v.name,
        description: v.description,
        prompt: v.prompt,
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
    emit("success", {
        ...v,
        botId: botCount+1
    })
})


const models = useModel()

</script>
<template>
   <form class="space-y-6" @submit.prevent="onSubmit" method="POST" novalidate >
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
                        <Textarea  v-bind="componentField" placeholder='Imagine you are having a casual conversation with a new friend. Use polite, conversational language and tone. Avoid controversial or overly personal topics.'></Textarea>
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
                        ? models.find((model) => model.model_id === chosenModel)?.name
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
                            :key="model.model_id"
                            :value="model.model_id"
                            @select="(ev) => {
                                if (typeof ev.detail.value === 'string') {
                                    chosenModel = ev.detail.value
                                }
                                modelPopoverOpen = false
                            }"
                            >
                            {{ model.name }}
                            <CheckIcon
                                :class="cn(
                                'ml-auto h-4 w-4',
                                chosenModel === model.model_id ? 'opacity-100' : 'opacity-0',
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
                        <span>Top P <QuestionMark>Control the probability of the output tokens. Higher Top P will output the high probability tokens. Lower Top P enable wider token output.</QuestionMark></span>
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
                        <span>Temperature <QuestionMark>Control randomness of the output. Higher value means more random and creative, lower value means more predictable.</QuestionMark></span>
                        <Text type="small">{{ values.temperature?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="0" :max="2" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="max_gen_len">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        <span>Max Generation Length <QuestionMark>Maximum tokens that will be generated by the model.</QuestionMark></span>
                        <Text type="small">{{ values.max_gen_len?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="100" :max="1000" :step="10"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="frequency_penalty">
            <FormItem>
                <FormLabel>
                    <div class="flex justify-between mt-2">
                        <span>Frequency Penalty <QuestionMark>Help the model to not using the same token too often.</QuestionMark></span>
                        <Text type="small">{{ values.frequency_penalty?.[0] || 0 }}</Text>
                    </div>
                </FormLabel>
                <FormControl>
                    <Slider :min="-2" :max="2" :step="0.1"  v-bind="componentField"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <!-- <FormItem>
            <Text type="small">Feed bot </Text>
            <Input type="file" placeholder="EnglishHelperBot" ref="file" @change="onFileChange" accept="application/pdf, text/plain"/>
        </FormItem> -->
        <div class="flex justify-end">
        <Button type="submit" class="mb-10">
            Create
        </Button>
        </div>
    </form>
</template>