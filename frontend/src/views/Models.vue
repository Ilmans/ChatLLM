<script setup>
import { Text } from '@/components/ui/text';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useModel } from '@/composables/useModel';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-vue-next';
import { hasModelInCache } from "@mlc-ai/web-llm"
import { onMounted, ref } from 'vue';

const { model_list } = useModel()
const modelListWithStatus = ref([])

onMounted(async () => {
    for(let i = 0; i < model_list.length; i++) {
        const model = model_list[i]
        hasModelInCache(model.local_id, useModel())
            .then((v) => {
                modelListWithStatus.value.push({
                    ...model,
                    is_downloaded: v
                })
            })
    }
})

</script>
<template>
    <main class="px-8 w-full pt-16">
        <section>
            <div class="section-header mb-10">
                <Text type="h2">Models</Text>
                <Text type="p">These are models that are available to use</Text>
            </div>
            <div class="section-body">
                <Table v-if="modelListWithStatus.length == model_list.length">
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[100px]">
                                #
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>VRAM/RAM Required</TableHead>
                            <TableHead>Download</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(model, i) in modelListWithStatus">
                            <TableCell class="font-medium">
                                {{ i + 1 }}
                            </TableCell>
                            <TableCell>{{ model.local_id }}</TableCell>
                            <TableCell>{{ model.size }} MB</TableCell>
                            <TableCell>{{ model.vram_required_MB }} MB</TableCell>
                            <TableCell>
                                <div class="flex items-center" v-if="model.is_downloaded">
                                    <Check/> Downloaded
                                </div>
                                <Button variant="ghost" v-else>
                                    <Download/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>
    </main>
</template>