import * as pdfJs from "pdfjs-dist";
import * as pdfJsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs'
import type { TextItem } from "pdfjs-dist/types/src/display/api";
pdfJs.GlobalWorkerOptions.workerSrc = pdfJsWorker

const readPdf = (file: File) => {
    
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

const readFile = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject 
    reader.readAsText(blob)
})

export const getFileContent = (file: File): Promise<string> => {
    if (file.type == 'application/pdf') {
        return readPdf(file)
    } 
    return readFile(file)
}

