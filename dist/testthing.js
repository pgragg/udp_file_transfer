"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var fileDescriptor = fs_1.default.openSync('src/files/testthing.txt', 'a');
var buffer = Buffer.from('abcdefg');
fs_1.default.write(fileDescriptor, buffer, 0, buffer.length, 90, function (err, writtenBytes, buffer) {
    console.log("Wrote " + writtenBytes + " bytes to file");
});
