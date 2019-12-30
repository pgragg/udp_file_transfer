import { transferFile } from './modules/fileTransfer/transferFile'

if (!module.parent) {
  transferFile({
    port: 2222,
    fileName: './src/files/smol.txt',
    targetFileName: './src/files/smol2.txt'
  }).then(() => {
    console.log("Done")
  })
}
