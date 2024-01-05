import * as pdfJs from "pdfjs-dist";
import * as pdfJsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs'
import type { TextItem } from "pdfjs-dist/types/src/display/api";
pdfJs.GlobalWorkerOptions.workerSrc = pdfJsWorker
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { XenovaTransformersEmbeddings } from "@/utils/hf";
import { hasModelInCache } from "../../../../libs/web-llm"
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
import  '@tensorflow/tfjs-backend-cpu';
// Adds the WASM backend to the global backend registry.

const readPdf = (file: File): Promise<string> => {
    
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
        reader.readAsArrayBuffer(file)
    })

}

const readFile = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader
    reader.onload = e => resolve(e.target.result as string)
    reader.onerror = reject 
    reader.readAsText(blob)
})

export const getFileContent = async (file: File): Promise<string> => {
    if (file.type == 'application/pdf') {
        return await readPdf(file)
    } 
    return readFile(file)
}

export const getPrompt = async (fileText, userInput) => {
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })
    const docs = await textSplitter.createDocuments([fileText])
    const text = await textSplitter.splitDocuments(docs)
    
    console.log('splitted', text)
    try {
        const vectorStore = await MemoryVectorStore.fromTexts(
            [...docs.map(doc => doc.pageContent)],
            [...docs.map((_,k) => k)],
            new TensorFlowEmbeddings()
        )
        const queryResult = await vectorStore.similaritySearch(userInput, 2)
        const qaPrompt = `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Question: ${userInput}
=========
${queryResult.map(result => result.pageContent).join('')}
=========
Answer:
        `
        return qaPrompt
    } catch(err) {
        console.log(err)
    }
}