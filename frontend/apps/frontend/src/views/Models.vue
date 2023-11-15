<script setup>
import {Text} from '@/components/ui/text';
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
                            Invoice
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead class="text-right">
                            Amount
                            </TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        <TableRow>
                            <TableCell class="font-medium">
                            INV001
                            </TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell class="text-right">
                            $250.00
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