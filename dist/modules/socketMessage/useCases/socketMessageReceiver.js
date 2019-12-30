"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var fs_1 = __importDefault(require("fs"));
var SocketMessageReceiver = /** @class */ (function () {
    function SocketMessageReceiver(targetFileName) {
        this.targetFileName = targetFileName;
    }
    SocketMessageReceiver.prototype.receiveMessage = function (msg, info, socket) {
        // console.log("Data received from client : " + msg.toString());
        console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            console.log("Successfully received Message " + JSON.stringify(message));
            this.sendResponse(socket, info.port, 'success');
            this.enactMessage(message.success);
        }
        else {
            this.sendResponse(socket, info.port, 'failure');
        }
    };
    SocketMessageReceiver.prototype.enactMessage = function (message) {
        console.log({ message: message });
        if ('status' in message.payload) {
            return;
        }
        var document = message.payload;
        console.log({ targetFileName: this.targetFileName });
        var writeStream = fs_1.default.createWriteStream(this.targetFileName, { start: document.startByte });
        // buffer: TBuffer,
        // offset: number | undefined | null,
        // length: number | undefined | null,
        // position: number | undefined | null,
        var fileDescriptor = fs_1.default.openSync(this.targetFileName, 'a');
        var buffer = Buffer.from(document.data);
        fs_1.default.write(fileDescriptor, buffer, 0, buffer.length, document.startByte, function (err, writtenBytes, buffer) {
            console.log("Wrote " + writtenBytes + " bytes to file");
        });
    };
    SocketMessageReceiver.prototype.sendResponse = function (socket, port, status) {
        var message = new message_1.Message(new message_1.Status({ status: status })).toString();
        socket.send(message, port, "localhost", function (error) {
            if (error) {
                socket.close();
            }
            else {
                console.log("Server sent response to client on port " + port + " after message receipt");
            }
        });
    };
    return SocketMessageReceiver;
}());
exports.SocketMessageReceiver = SocketMessageReceiver;
