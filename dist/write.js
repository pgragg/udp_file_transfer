"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var write_1 = require("./modules/fileTransfer/write");
var generateWriterPorts_1 = require("./modules/ports/generateWriterPorts");
var txtFile = './src/files/smolCopy.txt';
var pdfFile = './src/files/typescriptCopy.pdf';
if (!module.parent) {
    process.env['DEBUG_LOG'] = 'false';
    write_1.write({
        targetFileName: txtFile,
        timeout: 120000,
        ports: generateWriterPorts_1.generateWriterPorts({ maxPoolSize: 2 })
    });
}
