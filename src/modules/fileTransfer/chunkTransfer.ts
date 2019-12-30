import * as udp from 'dgram'
import fs from 'fs'
import stream from 'stream'
import { Document, Message } from '../../entities/message'

export class ChunkTransfer {
    private fileName: string
    private startByte: number
    private endByte: number
    private totalBytes: number

    constructor({ fileName, startByte, endByte, totalBytes}: {
        fileName: string, startByte: number, endByte: number, totalBytes: number
    }) {
        this.fileName = fileName
        this.startByte = startByte
        this.endByte = endByte
        this.totalBytes = totalBytes
    }

    async execute(client: udp.Socket, port: number) {

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
                new Document({ startByte: this.startByte, totalBytes: this.totalBytes, data: buffer.join('') })
            ).toString()

            client.send(message, port, 'localhost', function (error: any) {
                if (error) {
                    client.close();
                }
            })
        })
    }

}