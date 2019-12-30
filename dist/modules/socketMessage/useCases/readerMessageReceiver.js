"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var ReaderMessageReceiver = /** @class */ (function () {
    function ReaderMessageReceiver(jobHandler) {
        this.jobHandler = jobHandler;
    }
    ReaderMessageReceiver.prototype.receiveMessage = function (msg, info, socket) {
        // console.log("Data received from client : " + msg.toString());
        console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            console.log("Successfully received Message " + JSON.stringify(message));
            this.enactMessage(message.success);
        }
        this.jobHandler.runJobs();
    };
    ReaderMessageReceiver.prototype.enactMessage = function (message) {
        if ('data' in message.payload) {
            return;
        }
        var status = message.payload;
        console.log("Received status " + JSON.stringify(status));
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
//   console.log('Data received from server : ' + msg.toString());
//   console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
// }
