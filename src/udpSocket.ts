import * as udp from 'dgram'

type MessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => void

export class UDPSocket {
  static create({
    port,
    timeout = 8000,
    messageCallback
  }: { port?: number | undefined, timeout?: number, messageCallback: MessageCallback }) {

    // creating a udp server
    var socket = udp.createSocket("udp4");

    // emits when any error occurs
    socket.on("error", function (error) {
      console.log("Error: " + error);
      socket.close();
    });

    // emits on new datagram msg
    socket.on("message", (msg, info) => {
      messageCallback(msg, info, socket)
    });

    //emits when socket is ready and listening for datagram msgs
    socket.on("listening", () => {
      var address = socket.address();
      var port = address.port;
      var family = address.family;
      var ipaddr = address.address;
      console.log("socket is listening at port: " + port);
      console.log("socket ip :" + ipaddr);
      console.log("socket is IP4/IP6 : " + family);
    });

    //emits after the socket is closed using socket.close();
    socket.on("close", () => {
      console.log("Socket is closed !");
    });

    if (port) {
      socket.bind(port);
    }

    setTimeout(function () {
      socket.close();
    }, timeout);

    return socket;
  }
}
