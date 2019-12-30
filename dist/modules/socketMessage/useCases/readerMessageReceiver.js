"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var ReaderMessageReceiver = /** @class */ (function () {
    function ReaderMessageReceiver(jobHandler) {
        this.jobHandler = jobHandler;
    }
    ReaderMessageReceiver.prototype.receiveMessage = function (msg, info, socket) {
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            this.enactMessage(message.success);
        }
        this.jobHandler.runJobs();
    };
    ReaderMessageReceiver.prototype.enactMessage = function (message) {
        if ('data' in message.payload) {
            return;
        }
        var status = message.payload;
        if (status.status === 'success') {
            if (status.startByte === undefined || Number.isNaN(status.startByte)) {
                return;
            }
            this.jobHandler.markComplete(Number(status.startByte));
        }
    };
    return ReaderMessageReceiver;
}());
exports.ReaderMessageReceiver = ReaderMessageReceiver;
