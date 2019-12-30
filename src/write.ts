import { write } from './modules/fileTransfer/write'


if (!module.parent) {
  process.env['DEBUG_LOG'] = 'false'
  write({
    port: 2222,
    targetFileName: './src/files/typescriptCopy.pdf',
    timeout: 120000
  })
}


// if (!module.parent) {
//   process.env['DEBUG_LOG'] = 'true'
//   write({
//     port: 2222,
//     targetFileName: './src/files/smolCopy.txt'
//   })
// }
