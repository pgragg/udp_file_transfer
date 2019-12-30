import { transferFile } from './modules/fileTransfer/transferFile'
import { JobHandler } from './modules/process/jobHandler'

// type GlobalType = typeof global; 
// interface GlobalPlus extends GlobalType {
//   jobHandler: JobHandler;
// } 

// const globalPlus: GlobalPlus = {...global, jobHandler: new JobHandler()};

if (!module.parent) {
  transferFile({
    port: 2222,
    fileName: './src/files/smol.txt',
    targetFileName: './src/files/smol2.txt'
  }).then(() => {
    console.log("Done")
  })
}
