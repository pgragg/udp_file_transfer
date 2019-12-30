import { Message } from '../../../entities/message';
import * as udp from 'dgram'
import { IMessageReceiver } from '../../../entities/udpSocket';
import { JobHandler } from '../../process/jobHandler';

export class ReaderMessageReceiver implements IMessageReceiver {
  constructor(private jobHandler: JobHandler) { }

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
      this.enactMessage(message.success);
    }
    this.jobHandler.runJobs();
  }

  private enactMessage(message: Message) {
    if ('data' in message.payload) {
      return
    }

    const status = message.payload;
    console.log(`Received status ${JSON.stringify(status)}`)
    if (status.status === 'success') {
      if (!status.startByte) { return }

      this.jobHandler.markComplete(status.startByte)

    }
  }

}

// const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
//   console.log('Data received from server : ' + msg.toString());
//   console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
// }