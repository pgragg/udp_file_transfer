import { read } from './modules/fileTransfer/read'
import { Logger } from './helpers/logger'
import { generateWriterPorts } from './modules/ports/generateWriterPorts'


const txtFile = './src/files/smol.txt'
const pdfFile = './src/files/typescript.pdf'

if (!module.parent) {
  process.env['DEBUG_LOG'] = 'false'
  read({
    writerPorts: generateWriterPorts({maxPoolSize: 2}),
    chunkSize: 2,
    fileName: txtFile,
    maxPoolSize: 2
  }).then(() => {
    Logger.log("Done")
  })
}

