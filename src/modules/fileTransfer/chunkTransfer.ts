import * as udp from 'dgram'
import fs from 'fs'
import stream from 'stream'
import { Document, Message } from '../../entities/message'
import { Logger } from '../../helpers/logger'

export class ChunkTransfer {
    private client: udp.Socket
    private port: number
    private fileName: string
    private startByte: number
    private endByte: number

    constructor({ client, port, fileName, startByte, endByte }: {
        client: udp.Socket, port: number, fileName: string, startByte: number, endByte: number
    }) {
        this.client = client
        this.port = port
        this.fileName = fileName
        this.startByte = startByte
        this.endByte = endByte
    }

    async execute() {
        let buffer: string[] = [];
        const writable = new stream.Writable({
            write: (chunk, encoding, next) => {
                buffer.push(chunk)
                next();
            }
        });

        fs.createReadStream(this.fileName, { start: this.startByte, end: this.endByte })
            .pipe(writable);



        writable.on('finish', () => {
            const message = new Message(
                new Document({ startByte: this.startByte, endByte: this.endByte, data: buffer.join('') })
            ).toString()

            const client = this.client;
            this.client.send(message, this.port, 'localhost', function (error: any) {
                if (error) {
                    client.close();
                }
            })
        })
    }

}