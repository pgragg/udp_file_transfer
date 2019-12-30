"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var read_1 = require("./modules/fileTransfer/read");
var logger_1 = require("./helpers/logger");
if (!module.parent) {
    process.env['DEBUG_LOG'] = 'false';
    read_1.read({
        port: 2222,
        chunkSize: 1500,
        fileName: './src/files/typescript.pdf',
        maxPoolSize: 100
    }).then(function () {
        logger_1.Logger.log("Done");
    });
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
