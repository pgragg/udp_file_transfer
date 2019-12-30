import { Message, Status } from '../../../entities/message';
import * as udp from 'dgram'
import fs from 'fs'
import { IMessageReceiver } from '../../../entities/udpSocket';
import { Logger } from '../../../helpers/logger';
import { Result } from '../../../helpers/result';
import { SimpleResult } from '../../../helpers/SimpleResult';

export class WriterMessageReceiver implements IMessageReceiver {
  constructor(private targetFileName: string) { }
  public receiveMessage(msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) {

    const message = Message.fromString(msg.toString())
    if (message.success) {
      Logger.log(`Successfully received message with startByte: ${message.success.payload.startByte}`)
      this.enactMessage(message.success);
      this.sendResponse(socket, info.port, 'success', message.success.payload.startByte)

    } else {
      this.sendResponse(socket, info.port, 'failure');
    }
  }
  private async enactMessage(message: Message): Promise<SimpleResult<null, NodeJS.ErrnoException>> {
    if (!('data' in message.payload)) {
      return Result.Failure(new Error('Expected data field.'))
    }

    const document = message.payload;
    const fileDescriptor = fs.openSync(this.targetFileName, 'a')
    const buffer = Buffer.from(document.data)

    return await new Promise((resolve) => {
      fs.write(fileDescriptor, buffer, 0, buffer.length, document.startByte, (err: NodeJS.ErrnoException | null, writtenBytes: number, buffer: Buffer) => {
        if(err){
          resolve(Result.Failure(err))
        }
        Logger.log(`Wrote ${writtenBytes} bytes to file ${this.targetFileName}`);
        resolve(Result.Success(null));
      });
    })
  }

  private sendResponse(socket: udp.Socket, port: number, status: 'failure' | 'success', startByte?: number) {
    const message = new Message(
      new Status({ status, startByte })
    ).toString();

    socket.send(message, port, "localhost", (error) => {
      if (error) {
        socket.close();
      } else {
        Logger.log(`Server sent response to client on port ${port} after message receipt`);
      }
    });
  }

}
