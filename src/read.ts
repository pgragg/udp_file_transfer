import { read } from './modules/fileTransfer/read'
import { Logger } from './helpers/logger'

// if (!module.parent) {
//   process.env['DEBUG_LOG'] = 'true'
//   read({
//     port: 2222,
//     fileName: './src/files/typescript.pdf',
//     targetFileName: './src/files/typescript2.pdf'
//   }).then(() => {
//     Logger.log("Done")
//   })
// }


if (!module.parent) {
  process.env['DEBUG_LOG'] = 'true'
  read({
    port: 2222,
    chunkSize: 1,
    fileName: './src/files/smol.txt'
  }).then(() => {
    Logger.log("Done")
  })
}