"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var document_1 = require("../../../entities/document");
var ReceiveSocketMessage = /** @class */ (function () {
    function ReceiveSocketMessage() {
    }
    ReceiveSocketMessage.execute = function (msg, info, socket) {
        // console.log("Data received from client : " + msg.toString());
        console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
        var document = document_1.Document.fromString(msg.toString());
        if (document.success) {
            console.log("Successfully received document " + JSON.stringify(document));
        }
        else {
            socket.send("Document failed to receive " + msg.toString() + " => " + JSON.stringify(document), info.port, "localhost", function (error) {
                if (error) {
                    socket.close();
                }
                else {
                    console.log("Server sent response to client on port " + info.port + " after message receipt");
                }
            });
        }
    };
    return ReceiveSocketMessage;
}());
exports.ReceiveSocketMessage = ReceiveSocketMessage;
