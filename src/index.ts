import * as udp from 'dgram'
import { UDPSocket } from './entities/udpSocket'
import { Message, Document } from './entities/message'
import fs from 'fs'
import stream from 'stream'
import { SocketMessageReceiver } from './modules/socketMessage/useCases/socketMessageReceiver'

const readFile = async (filepath: string) => {
  console.log(`Reading filepath ${filepath}`)
  const file: Buffer = await new Promise((resolve, reject) => {
    fs.readFile(filepath, {}, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
  return file;
}

const clientMessageCallback = (msg: Buffer, info: udp.RemoteInfo, socket: udp.Socket) => {
  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
}

const duplicateFile = async ({ port, fileName, targetFileName, startByte, endByte }: {
  port: number, fileName: string, targetFileName: string, startByte: number, endByte: number
}) => {
  const timeout = 5000;

  UDPSocket.create({ port, timeout, messageReceiver: new SocketMessageReceiver(targetFileName) })
  const client = UDPSocket.create({ timeout, messageReceiver: {receiveMessage: clientMessageCallback} })

  // let file = await readFile('./src/files/typescript.pdf')
  let file = await readFile(fileName)

  console.log({ file })
  //sending msg

  let buffer: string[] = [];
  const writable = new stream.Writable({
    write: (chunk, encoding, next) => {
      console.log({ chunk });
      buffer.push(chunk)
      next();
    }
  });

  fs.createReadStream(fileName, { start: startByte, end: endByte })
    .pipe(writable);

  writable.on('finish', () => {
    const message = new Message(
      new Document({ startByte, endByte, data: buffer.join('') })
    ).toString()

    client.send(message, port, 'localhost', function (error: any) {
      if (error) {
        client.close();
      } else {
        console.log(`Data sent to port ${port}`);
      }
    });
  })


}

if (!module.parent) {
  // Create n processes at once to read k bytes from the fileName 
  // send a Message as follows: 
  // {
  //   meta: {
  //     startByte: 0,
  //     endByte: 10,
  //     checksum: checksum
  //   },
  //   data: data
  // }
  // The server will receive the Message and verify the checksum 
  // if the checksum does not pass, the server will respond with a failure message
  // if the checksum does pass, the server will respond with a success message.
  duplicateFile({ port: 2222, fileName: './src/files/typescript.pdf', targetFileName: './src/files/typescript2.pdf', startByte: 0, endByte: 10 }).then(() => {
    console.log("Done")
  })
}
