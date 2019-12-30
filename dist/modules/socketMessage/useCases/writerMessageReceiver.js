"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var fs_1 = __importDefault(require("fs"));
var logger_1 = require("../../../helpers/logger");
var WriterMessageReceiver = /** @class */ (function () {
    function WriterMessageReceiver(targetFileName) {
        this.targetFileName = targetFileName;
    }
    WriterMessageReceiver.prototype.receiveMessage = function (msg, info, socket) {
        logger_1.Logger.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            logger_1.Logger.log("Successfully received Message " + JSON.stringify(message));
            this.sendResponse(socket, info.port, 'success', message.success.payload.startByte);
            this.enactMessage(message.success);
        }
        else {
            this.sendResponse(socket, info.port, 'failure');
        }
    };
    WriterMessageReceiver.prototype.enactMessage = function (message) {
        if ('status' in message.payload) {
            return;
        }
        var document = message.payload;
        var fileDescriptor = fs_1.default.openSync(this.targetFileName, 'a');
        var buffer = Buffer.from(document.data);
        fs_1.default.write(fileDescriptor, buffer, 0, buffer.length, document.startByte, function (err, writtenBytes, buffer) {
            logger_1.Logger.log("Wrote " + writtenBytes + " bytes to file");
        });
    };
    WriterMessageReceiver.prototype.sendResponse = function (socket, port, status, startByte) {
        var message = new message_1.Message(new message_1.Status({ status: status, startByte: startByte })).toString();
        socket.send(message, port, "localhost", function (error) {
            if (error) {
                socket.close();
            }
            else {
                logger_1.Logger.log("Server sent response to client on port " + port + " after message receipt");
            }
        });
    };
    return WriterMessageReceiver;
}());
exports.WriterMessageReceiver = WriterMessageReceiver;
