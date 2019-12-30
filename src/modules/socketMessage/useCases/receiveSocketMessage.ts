import { Message, Status } from '../../../entities/message';
import * as udp from 'dgram'

export class ReceiveSocketMessage {
  public static execute(msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) {
    // console.log("Data received from client : " + msg.toString());
    console.log(
      "Received %d bytes from %s:%d\n",
      msg.length,
      info.address,
      info.port
    );

    const message = Message.fromString(msg.toString())
    if (message.success) {
      console.log(`Successfully received Message ${JSON.stringify(message)}`)
      ReceiveSocketMessage.sendResponse(socket, info.port, 'success')
    } else {
      ReceiveSocketMessage.sendResponse(socket, info.port, 'failure')
    }
  }

  private static sendResponse(socket: udp.Socket, port: number, status: 'failure' | 'success') {
    const message = new Message(
      new Status({ status })
    ).toString()
    socket.send(message, port, "localhost", (error) => {
      if (error) {
        socket.close();
      } else {
        console.log(`Server sent response to client on port ${port} after message receipt`);
      }
    });
  }

}
