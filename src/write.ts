import { write } from './modules/fileTransfer/write'

if (!module.parent) {
  process.env['DEBUG_LOG'] = 'true'
  write({
    port: 2222,
    targetFileName: './src/files/targetFileOut.txt'
  })
}
