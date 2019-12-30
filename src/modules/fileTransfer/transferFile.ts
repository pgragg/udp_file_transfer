import * as udp from 'dgram'
import fs from 'fs'
import stream from 'stream'
import { SocketMessageReceiver } from '../socketMessage/useCases/socketMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'
import { Document, Message } from '../../entities/message'

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

const transferChunk = async ({ client, port, fileName, startByte, endByte }: {
    client: udp.Socket, port: number, fileName: string, startByte: number, endByte: number
}) => {
    
    let buffer: string[] = [];
    const writable = new stream.Writable({
        write: (chunk, encoding, next) => {
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



export const transferFile = async ({ port, fileName, targetFileName }: {
    port: number, fileName: string, targetFileName: string
}) => {

    // Create n processes at once to read k bytes from the fileName
    // The server will receive the Message and verify the checksum 
    // if the checksum does not pass, the server will respond with a failure message
    // if the checksum does pass, the server will respond with a success message.

    const timeout = 5000;
    UDPSocket.create({ port, timeout, messageReceiver: new SocketMessageReceiver(targetFileName) })
    const client = UDPSocket.create({ timeout, messageReceiver: { receiveMessage: clientMessageCallback } })

    
    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    const chunkSize = 10;
    let startByte = 0;

    let promises: Promise<any>[] = [];
    while(startByte < fileSizeInBytes){
        const endByte = startByte + chunkSize;
        promises.push(transferChunk({client, port, fileName, startByte, endByte}))
        startByte += chunkSize;
    }
    await Promise.all(promises);

}
