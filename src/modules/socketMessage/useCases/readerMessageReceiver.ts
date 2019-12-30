import { Message } from '../../../entities/message';
import * as udp from 'dgram'
import { IMessageReceiver } from '../../../entities/udpSocket';
import { JobHandler } from '../../process/jobHandler';
import { Logger } from '../../../helpers/logger';

export class ReaderMessageReceiver implements IMessageReceiver {
  constructor(private jobHandler: JobHandler) { }

  public receiveMessage(msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) {
    // Logger.log("Data received from client : " + msg.toString());
    Logger.log(
      "Received %d bytes from %s:%d\n",
      msg.length,
      info.address,
      info.port
    );

    const message = Message.fromString(msg.toString())
    if (message.success) {
      Logger.log(`Successfully received Message ${JSON.stringify(message)}`)
      this.enactMessage(message.success);
    }
    this.jobHandler.runJobs();
  }

  private enactMessage(message: Message) {
    if ('data' in message.payload) {
      return
    }

    const status = message.payload;
    Logger.log(`Received status ${JSON.stringify(status)}`)
    if (status.status === 'success') {
      Logger.log(`Status was success at startByte ${status.startByte}`)
      if (status.startByte === undefined || Number.isNaN(status.startByte)) { return }
      Logger.log(`startByte present at ${status.startByte}`)
      this.jobHandler.markComplete(Number(status.startByte))
    }
  }

}

// const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
//   Logger.log('Data received from server : ' + msg.toString());
//   Logger.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
// }