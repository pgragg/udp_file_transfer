"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transferFile_1 = require("./modules/fileTransfer/transferFile");
if (!module.parent) {
    transferFile_1.transferFile({
        port: 2222,
        fileName: './src/files/smol.txt',
        targetFileName: './src/files/smol2.txt'
    }).then(function () {
        console.log("Done");
    });
}
