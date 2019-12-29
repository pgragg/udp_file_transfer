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
        var _b = _a.port, port = _b === void 0 ? 2222 : _b, _c = _a.timeout, timeout = _c === void 0 ? 8000 : _c;
        // creating a udp server
        var server = udp.createSocket("udp4");
        // emits when any error occurs
        server.on("error", function (error) {
            console.log("Error: " + error);
            server.close();
        });
        // emits on new datagram msg
        server.on("message", function (msg, info) {
            console.log("Data received from client : " + msg.toString());
            console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
            //sending msg
            server.send("Thanks for the message, \"" + msg + ",\" client!", info.port, "localhost", function (error) {
                if (error) {
                    server.close();
                }
                else {
                    console.log("Data sent !!!");
                }
            });
        });
        //emits when socket is ready and listening for datagram msgs
        server.on("listening", function () {
            var address = server.address();
            var port = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log("Server is listening at port: " + port);
            console.log("Server ip :" + ipaddr);
            console.log("Server is IP4/IP6 : " + family);
        });
        //emits after the socket is closed using socket.close();
        server.on("close", function () {
            console.log("Socket is closed !");
        });
        server.bind(port);
        setTimeout(function () {
            server.close();
        }, timeout);
    };
    return UDPSocket;
}());
exports.UDPSocket = UDPSocket;
