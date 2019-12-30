"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var write_1 = require("./modules/fileTransfer/write");
if (!module.parent) {
    process.env['DEBUG_LOG'] = 'true';
    write_1.write({
        port: 2222,
        targetFileName: './src/files/targetFileOut.txt'
    });
}
