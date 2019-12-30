import * as udp from 'dgram'
import fs from 'fs'
import stream from 'stream'
import { Document, Message } from '../../entities/message'

export class ChunkTransfer {
    private port: number
    private fileName: string
    private startByte: number
    private endByte: number

    constructor({ port, fileName, startByte, endByte }: {
        port: number, fileName: string, startByte: number, endByte: number
    }) {
        this.port = port
        this.fileName = fileName
        this.startByte = startByte
        this.endByte = endByte
    }

    async execute(client: udp.Socket) {

        let buffer: string[] = [];
        const writable = new stream.Writable({
            write: (chunk, encoding, next) => {
                buffer.push(chunk)
                next();
            }
        });

        fs.createReadStream(this.fileName, { start: this.startByte, end: this.endByte })
            .pipe(writable);

        // if(Math.random() > 0.3){
        //     return
        // }

        writable.on('finish', () => {
            const message = new Message(
                new Document({ startByte: this.startByte, endByte: this.endByte, data: buffer.join('') })
            ).toString()

            client.send(message, this.port, 'localhost', function (error: any) {
                if (error) {
                    client.close();
                }
            })
        })
    }

}