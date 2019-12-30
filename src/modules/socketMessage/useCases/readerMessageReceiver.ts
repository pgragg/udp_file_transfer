import { Message } from '../../../entities/message';
import * as udp from 'dgram'
import { IMessageReceiver } from '../../../entities/udpSocket';
import { JobHandler } from '../../process/jobHandler';
import { Logger } from '../../../helpers/logger';

export class ReaderMessageReceiver implements IMessageReceiver {
  constructor(private jobHandler: JobHandler) { }

  public receiveMessage(msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) {
    const message = Message.fromString(msg.toString())
    if (message.success) {
      this.enactMessage(message.success);
    }
    this.jobHandler.runJobs();
  }

  private enactMessage(message: Message) {
    if ('data' in message.payload) {
      return
    }

    const status = message.payload;
    if (status.status === 'success') {
      if (status.startByte === undefined || Number.isNaN(status.startByte)) { return }
      this.jobHandler.markComplete(Number(status.startByte))
    }
  }
}