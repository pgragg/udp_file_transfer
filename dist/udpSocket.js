"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var udp = __importStar(require("dgram"));
var UDPSocket = /** @class */ (function () {
    function UDPSocket() {
    }
    UDPSocket.create = function (_a) {
        var port = _a.port, _b = _a.timeout, timeout = _b === void 0 ? 8000 : _b, messageCallback = _a.messageCallback;
        // creating a udp server
        var socket = udp.createSocket("udp4");
        // emits when any error occurs
        socket.on("error", function (error) {
            console.log("Error: " + error);
            socket.close();
        });
        // emits on new datagram msg
        socket.on("message", function (msg, info) {
            messageCallback(msg, info, socket);
        });
        //emits when socket is ready and listening for datagram msgs
        socket.on("listening", function () {
            var address = socket.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log("socket is listening at port: " + port);
            console.log("socket ip :" + ipaddr);
            console.log("socket is IP4/IP6 : " + family);
        });
        //emits after the socket is closed using socket.close();
        socket.on("close", function () {
            console.log("Socket is closed !");
        });
        if (port) {
            socket.bind(port);
        }
        setTimeout(function () {
            socket.close();
        }, timeout);
        return socket;
    };
    return UDPSocket;
}());
exports.UDPSocket = UDPSocket;