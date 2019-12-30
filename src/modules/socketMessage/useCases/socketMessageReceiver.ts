import { Message, Status } from '../../../entities/message';
import * as udp from 'dgram'
import fs from 'fs'
import { IMessageReceiver } from '../../../entities/udpSocket';

export class SocketMessageReceiver implements IMessageReceiver {
  constructor(private targetFileName: string) { }
  public receiveMessage(msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) {
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
      this.sendResponse(socket, info.port, 'success')
      this.enactMessage(message.success);
    } else {
      this.sendResponse(socket, info.port, 'failure')
    }
  }
  private enactMessage(message: Message) {
    if ('status' in message.payload) {
      return
    }
    
    const document = message.payload;
    const fileDescriptor = fs.openSync(this.targetFileName, 'a')
    const buffer = Buffer.from(document.data)

    fs.write(fileDescriptor, buffer, 0, buffer.length, document.startByte, (err: NodeJS.ErrnoException | null, writtenBytes: number, buffer: Buffer) => {
      console.log(`Wrote ${writtenBytes} bytes to file`);
    });

  }

  private sendResponse(socket: udp.Socket, port: number, status: 'failure' | 'success') {
    const message = new Message(
      new Status({ status })
    ).toString();

    socket.send(message, port, "localhost", (error) => {
      if (error) {
        socket.close();
      } else {
        console.log(`Server sent response to client on port ${port} after message receipt`);
      }
    });
  }

}
