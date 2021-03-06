"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var result_1 = require("../helpers/result");
var logger_1 = require("../helpers/logger");
var checksum = function (str) {
    return crypto_1.default
        .createHash('md5')
        .update(str, 'utf8')
        .digest('hex');
};
exports.MessageCheckSumMismatchMessage = 'Error: Message checksum mismatch.';
exports.InvalidJSONFormatMessage = 'Error: invalid JSON. Could not parse.';
var Document = /** @class */ (function () {
    function Document(_a) {
        var startByte = _a.startByte, totalBytes = _a.totalBytes, data = _a.data;
        this.startByte = startByte;
        this.totalBytes = totalBytes;
        this.data = data;
    }
    return Document;
}());
exports.Document = Document;
var Status = /** @class */ (function () {
    function Status(_a) {
        var status = _a.status, startByte = _a.startByte;
        this.status = status;
        this.startByte = startByte;
    }
    return Status;
}());
exports.Status = Status;
var Message = /** @class */ (function () {
    function Message(payload) {
        this.payload = payload;
        this.checksum = Message.calculateChecksum(this);
        Object.freeze(this);
    }
    Message.prototype.toString = function () {
        return JSON.stringify(this);
    };
    Message.fromString = function (docString) {
        var docResult = this.parseDoc(docString);
        if (docResult.failure) {
            return docResult;
        }
        var doc = docResult.success;
        if (doc.checksum === Message.calculateChecksum(doc)) {
            return result_1.Result.Success(doc);
        }
        logger_1.Logger.log(exports.MessageCheckSumMismatchMessage);
        return result_1.Result.Failure(new Error(exports.MessageCheckSumMismatchMessage));
    };
    Message.parseDoc = function (docString) {
        try {
            return result_1.Result.Success(JSON.parse(docString));
        }
        catch (error) {
            return result_1.Result.Failure(new Error(exports.InvalidJSONFormatMessage));
        }
    };
    Message.calculateChecksum = function (doc) {
        var docCopy = JSON.parse(JSON.stringify(doc));
        delete docCopy.checksum;
        return checksum(docCopy.toString());
    };
    return Message;
}());
exports.Message = Message;
