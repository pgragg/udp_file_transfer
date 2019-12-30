"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var logger_1 = require("../../../helpers/logger");
var ReaderMessageReceiver = /** @class */ (function () {
    function ReaderMessageReceiver(jobHandler) {
        this.jobHandler = jobHandler;
    }
    ReaderMessageReceiver.prototype.receiveMessage = function (msg, info, socket) {
        // Logger.log("Data received from client : " + msg.toString());
        logger_1.Logger.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            logger_1.Logger.log("Successfully received Message " + JSON.stringify(message));
            this.enactMessage(message.success);
        }
        this.jobHandler.runJobs();
    };
    ReaderMessageReceiver.prototype.enactMessage = function (message) {
        if ('data' in message.payload) {
            return;
        }
        var status = message.payload;
        logger_1.Logger.log("Received status " + JSON.stringify(status));
        if (status.status === 'success') {
            if (!status.startByte) {
                return;
            }
            this.jobHandler.markComplete(status.startByte);
        }
    };
    return ReaderMessageReceiver;
}());
exports.ReaderMessageReceiver = ReaderMessageReceiver;
// const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
//   Logger.log('Data received from server : ' + msg.toString());
//   Logger.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
// }
