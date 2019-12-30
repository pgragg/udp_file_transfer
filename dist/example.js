"use strict";
// import * as udp from 'dgram'
// import { UDPSocket } from './entities/udpSocket'
// const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
//   Logger.log('Data received from server : ' + msg.toString());
//   Logger.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
// }
// const serverMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
//   Logger.log("Data received from client : " + msg.toString());
//   Logger.log(
//     "Received %d bytes from %s:%d\n",
//     msg.length,
//     info.address,
//     info.port
//   );
//   //sending msg
//   socket.send(`Thanks for the message, client!`, info.port, "localhost", (error) => {
//     if (error) {
//       socket.close();
//     } else {
//       Logger.log(`Server sent response to client on port ${info.port} after message receipt`);
//     }
//   });
// }
// const serverPort = 2222;
// UDPSocket.create({ port: serverPort, messageCallback: serverMessageCallback })
// const client = UDPSocket.create({ messageCallback: clientMessageCallback })
// //buffer msg
// var data = Buffer.from('my message is thusly, said the king.');
// //sending msg
// client.send(data, serverPort, 'localhost', function (error: any) {
//   if (error) {
//     client.close();
//   } else {
//     Logger.log(`Data sent to port ${serverPort}`);
//   }
// });
