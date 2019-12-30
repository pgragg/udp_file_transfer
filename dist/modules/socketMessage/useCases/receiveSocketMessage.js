"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../../../entities/message");
var ReceiveSocketMessage = /** @class */ (function () {
    function ReceiveSocketMessage() {
    }
    ReceiveSocketMessage.execute = function (msg, info, socket) {
        // console.log("Data received from client : " + msg.toString());
        console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var message = message_1.Message.fromString(msg.toString());
        if (message.success) {
            console.log("Successfully received Message " + JSON.stringify(message));
            ReceiveSocketMessage.sendResponse(socket, info.port, 'success');
        }
        else {
            ReceiveSocketMessage.sendResponse(socket, info.port, 'failure');
        }
    };
    ReceiveSocketMessage.sendResponse = function (socket, port, status) {
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
    return ReceiveSocketMessage;
}());
exports.ReceiveSocketMessage = ReceiveSocketMessage;
