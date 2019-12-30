"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var read_1 = require("./modules/fileTransfer/read");
var logger_1 = require("./helpers/logger");
var generateWriterPorts_1 = require("./modules/ports/generateWriterPorts");
var txtFile = './src/files/smol.txt';
var pdfFile = './src/files/typescript.pdf';
if (!module.parent) {
    process.env['DEBUG_LOG'] = 'false';
    read_1.read({
        writerPorts: generateWriterPorts_1.generateWriterPorts({ maxPoolSize: 2 }),
        chunkSize: 2,
        fileName: txtFile,
        maxPoolSize: 2
    }).then(function () {
        logger_1.Logger.log("Done");
    });
}
