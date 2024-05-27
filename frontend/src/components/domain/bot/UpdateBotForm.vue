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
import { CheckIcon, ChevronsUpDown, X } from 'lucide-vue-next'
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
    params: {
        frequency_penalty: [0.5],
        max_gen_len: [300],
        top_p: [0.7],
        temperature: [0.4],
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
    temperature: z.array(z.number().min(0).max(2)).nullable(),
    frequency_penalty: z.array(z.number().min(-2).max(2)).nullable(),
    max_gen_len: z.array(z.number().min(0).max(1000)).nullable(),
}))

const { handleSubmit, values, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
        max_gen_len: [300],
        frequency_penalty: [0.5],
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
        frequency_penalty: activeBot.params.frequency_penalty,
        top_p: activeBot.params.top_p,
        temperature: activeBot.params.temperature,
        max_gen_len: activeBot.params.max_gen_len,
    })
})



const onSubmit = handleSubmit(async (v) => {
    const botCount = (await db.getBots()).length
    const {toast} = useToast()
    activeBot.botId = chosenModel.value
    activeBot.description = v.description
    activeBot.name = v.name
    activeBot.params.frequency_penalty = v.frequency_penalty
    activeBot.params.max_gen_len = v.max_gen_len
    activeBot.params.temperature = v.temperature
    activeBot.params.top_p = v.top_p
    activeBot.prompt = v.prompt
    toast({
        title: "Bot updated successfully",
        variant: 'success'
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
                    <Slider :min="0" :max="2" :step="0.1"  v-bind="componentField" :value="activeBot?.params.temperature"></Slider>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="max_gen_len">
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
        <div class="flex justify-end">
        <Button type="submit">
            Update
        </Button>
        </div>
    </form>
</template>