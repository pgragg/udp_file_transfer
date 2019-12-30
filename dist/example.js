"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var udpSocket_1 = require("./entities/udpSocket");
var clientMessageCallback = function (msg, info, socket) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
};
var serverMessageCallback = function (msg, info, socket) {
    console.log("Data received from client : " + msg.toString());
    console.log("Received %d bytes from %s:%d\n", msg.length, info.address, info.port);
    //sending msg
    socket.send("Thanks for the message, client!", info.port, "localhost", function (error) {
        if (error) {
            socket.close();
        }
        else {
            console.log("Server sent response to client on port " + info.port + " after message receipt");
        }
    });
};
var serverPort = 2222;
udpSocket_1.UDPSocket.create({ port: serverPort, messageCallback: serverMessageCallback });
var client = udpSocket_1.UDPSocket.create({ messageCallback: clientMessageCallback });
//buffer msg
var data = Buffer.from('my message is thusly, said the king.');
//sending msg
client.send(data, serverPort, 'localhost', function (error) {
    if (error) {
        client.close();
    }
    else {
        console.log("Data sent to port " + serverPort);
    }
});
