import { read } from './modules/fileTransfer/read'
import { Logger } from './helpers/logger'

if (!module.parent) {
  process.env['DEBUG_LOG'] = 'false'
  read({
    port: 2222,
    chunkSize: 1500,
    fileName: './src/files/typescript.pdf',
    maxPoolSize: 100
  }).then(() => {
    Logger.log("Done")
  })
}


// if (!module.parent) {
//   process.env['DEBUG_LOG'] = 'true'
//   read({
//     port: 2222,
//     chunkSize: 20,
//     fileName: './src/files/smol.txt'
//   }).then(() => {
//     Logger.log("Done")
//   })
// }