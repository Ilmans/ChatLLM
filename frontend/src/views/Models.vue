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
import { Download } from 'lucide-vue-next';

const { model_list } = useModel()

</script>
<template>
    <main class="px-8 w-full">
        <section>
            <div class="section-header mb-10">
                <Text type="h2">Models</Text>
                <Text type="p">These are models that are available to use</Text>
            </div>
            <div class="section-body">
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle>Model List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead class="w-[100px]">
                                        #
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Download</TableHead>
                                    <TableHead>Size</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(model, i) in model_list">
                                    <TableCell class="font-medium">
                                        {{ i + 1 }}
                                    </TableCell>
                                    <TableCell>{{ model.local_id }}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost">
                                            <Download/>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        10GB
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    </main>
</template>