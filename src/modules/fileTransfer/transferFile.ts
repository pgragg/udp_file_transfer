import * as udp from 'dgram'
import fs from 'fs'
import stream from 'stream'
import { WriterMessageReceiver } from '../socketMessage/useCases/writerMessageReceiver'
import { UDPSocket } from '../../entities/udpSocket'
import { Document, Message } from '../../entities/message'
import { ReaderMessageReceiver } from '../socketMessage/useCases/readerMessageReceiver'
import { JobHandler, Job } from '../process/jobHandler'

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
    const jobHandler = new JobHandler()

    const timeout = 5000;
    UDPSocket.create({ port, timeout, messageReceiver: new WriterMessageReceiver(targetFileName) })

    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    console.log({ fileSizeInBytes })
    const chunkSize = 1000;
    let startByte = 0;

    let promises: Promise<any>[] = [];
    while (startByte < fileSizeInBytes) {
        const endByte = startByte + chunkSize;
        const client = UDPSocket.create({ messageReceiver: new ReaderMessageReceiver(jobHandler) })
        const taskPromise = transferChunk({ client, port, fileName, startByte, endByte });
        const job = new Job({id: startByte, task: taskPromise})
        jobHandler.add(job)
        startByte += chunkSize;
    }
    jobHandler.runJobs();

}
