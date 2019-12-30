import { transferFile } from './modules/fileTransfer/transferFile'

if (!module.parent) {
  transferFile({
    port: 2222,
    fileName: './src/files/typescript.pdf', 
    targetFileName: './src/files/typescript2.pdf'
  }).then(() => {
    console.log("Done")
  })
}
