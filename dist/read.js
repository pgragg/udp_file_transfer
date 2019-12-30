"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var read_1 = require("./modules/fileTransfer/read");
var logger_1 = require("./helpers/logger");
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
    process.env['DEBUG_LOG'] = 'true';
    read_1.read({
        port: 2222,
        chunkSize: 1,
        fileName: './src/files/smol.txt'
    }).then(function () {
        logger_1.Logger.log("Done");
    });
}
