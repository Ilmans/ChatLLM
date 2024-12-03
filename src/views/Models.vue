<script setup lang="ts">
import { Text } from '@/components/ui/text';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { useModel, additionalModels } from '@/composables/useModel';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-vue-next';
import { hasModelInCache, prebuiltAppConfig } from '@mlc-ai/web-llm';
import { onMounted, ref } from 'vue';
import { useLLM } from '@/composables/useLLM';
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
import Badge from '@/components/ui/badge/Badge.vue';

const model_list = useModel();
const modelListWithStatus = ref([]);

onMounted(async () => {
  for (let i = 0; i < model_list.length; i++) {
    const model = model_list[i];
    hasModelInCache(model.model_id, {
      model_list: [...prebuiltAppConfig.model_list, ...additionalModels],
    }).then((v) => {
      modelListWithStatus.value.push({
        ...model,
        is_downloaded: v,
        progressDownload: -1,
        download,
      });
    });
  }
  console.log(modelListWithStatus.value);
});
const llm = useLLM();
const download = (modelId: string) => {
  const model = modelListWithStatus.value.find((v) => v.model_id == modelId);
  model.progressDownload = 0;
  llm
    .loadModel(modelId, (report) => {
      console.log(report);
      model.progressDownload = Math.round(report.progress * 100);
    })
    .then(() => {
      model.is_downloaded = true;
    });
};

const detailModalOpen = ref(false);
const modalData = ref(null);
</script>
<template>
  <main class="px-8 w-full pt-16">
    <section>
      <div class="section-header mb-10">
        <Text type="h2">Models</Text>
        <Text type="p">These are models that are available to use</Text>
      </div>
      <div class="section-body">
        <Card class="py-5 rounded-lg border-gray-300">
          <Dialog v-model:open="detailModalOpen">
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Model Detail</DialogTitle>
                <DialogDescription>
                  <Table>
                    <TableRow><TableCell>Author</TableCell><TableCell>{{modalData.author}}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Link</TableCell>
                        <TableCell><a :href="modalData.link">{{modalData.link}}</a></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Release Date</TableCell><TableCell>{{modalData.releaseDate}}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Used For</TableCell>
                        <TableCell>
                            <div class="flex gap-2 flex-wrap">
                                <Badge v-for="usedFor in modalData.usedFor">{{ usedFor }}</Badge>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Language Support</TableCell>
                        <TableCell>
                            <div class="flex gap-2 flex-wrap">
                            <Badge v-for="lang in modalData.languageSupport">{{ lang }}</Badge>
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>notes</TableCell><TableCell>{{modalData.notes}}</TableCell>
                    </TableRow>
                  </Table>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[100px]"> # </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>VRAM/RAM Required</TableHead>
                  <TableHead>Download</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(model, i) in modelListWithStatus">
                  <TableCell class="font-medium">
                    {{ i + 1 }}
                  </TableCell>
                  <TableCell>{{ model.name }}</TableCell>
                  <TableCell>{{ model.vram_required_MB }} MB</TableCell>
                  <TableCell>
                    <div class="flex items-center" v-if="model.is_downloaded">
                      <Check /> Downloaded
                    </div>
                    <span v-else-if="model.progressDownload >= 0" class="px-5">
                      {{ model.progressDownload }}%
                    </span>
                    <Button
                      variant="ghost"
                      v-else
                      @click="download(model.model_id)"
                    >
                      <Download />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DialogTrigger
                      @click="modalData = model.info"
                      class="menu-link w-full px-3 py-2 bg-transparent text-gray-500 dark:hover:text-gray-200 hover:text-primary transition duration-200 rounded-md flex gap-2"
                    >
                      Detail
                    </DialogTrigger>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Dialog>
        </Card>
      </div>
    </section>
  </main>
</template>
<style>
th:first-child,
td:first-child {
  text-align: center;
}
</style>
