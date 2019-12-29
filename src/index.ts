import * as udp from 'dgram'
import { UDPSocket } from './udpSocket'

const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
}
const serverMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
  console.log("Data received from client : " + msg.toString());
  console.log(
    "Received %d bytes from %s:%d\n",
    msg.length,
    info.address,
    info.port
  );

  //sending msg
  socket.send(`Thanks for the message, "${msg}," client!`, info.port, "localhost", (error) => {
    if (error) {
      socket.close();
    } else {
      console.log("Data sent !!!");
    }
  });
}

const serverPort = 2222;

UDPSocket.create({ port: serverPort, messageCallback: serverMessageCallback })
const client = UDPSocket.create({ messageCallback: clientMessageCallback })

//buffer msg
var data = Buffer.from('my message is thusly, said the king.');

//sending msg
client.send(data, serverPort, 'localhost', function (error: any) {
  if (error) {
    client.close();
  } else {
    console.log('Data sent !!!');
  }
});