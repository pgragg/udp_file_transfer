import { write } from './modules/fileTransfer/write'
import { generateWriterPorts } from './modules/ports/generateWriterPorts'


const txtFile = './src/files/smolCopy.txt'
const pdfFile = './src/files/typescriptCopy.pdf'


if (!module.parent) {
  process.env['DEBUG_LOG'] = 'false'
  
  write({
    targetFileName: txtFile,
    timeout: 120000,
    ports: generateWriterPorts({maxPoolSize: 2})
  })
}